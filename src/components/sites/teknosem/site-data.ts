// Public site data, read from Supabase. Row level security already hides unpublished rows; on top of that a
// product is only shown when its group and category are published too. Requests are cached under CONTENT_TAG
// (see lib/supabase/public.ts) and deduplicated per render with React cache().

import "server-only";
import { cache } from "react";
import type { Json } from "@/lib/supabase/database.types";
import { mediaUrl } from "@/lib/supabase/media";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDate } from "./links";
import type { ImageAsset } from "./media";
import { contactInfo, readSettings, type ContactInfo, type Settings } from "./settings";

export type SpecRow = { label: string; value: string };
export type Faq = { question: string; answer: string };
export type Ref = { slug: string; title: string };

export type Manual = {
  id: string;
  title: string;
  model: string;
  version: string;
  /** dd.mm.yyyy, or "" when unknown. */
  date: string;
  src: string;
  size: number;
  product: { slug: string; name: string } | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  shortDescription: string;
  descriptionHtml: string;
  specs: SpecRow[];
  faqTitle: string;
  faq: Faq[];
  videos: string[];
  images: ImageAsset[];
  seo: { title: string; description: string };
  /** Newest published manual. */
  manual: Manual | null;
  category: Ref;
  group: Ref;
};

export type Group = Ref & { products: Product[] };
export type Category = Ref & { groups: Group[] };

export type SiteData = {
  /** Categories > groups > products, only the visible ones, in panel order. */
  catalog: Category[];
  products: Product[];
  product: (slug: string) => Product | undefined;
  /** Every published manual (İndirmeler), newest first within a product. */
  manuals: Manual[];
  settings: Settings;
  contact: ContactInfo;
  logos: ImageAsset[];
};

const isRecord = (value: Json): value is { [key: string]: Json } => !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: Json | undefined) => (typeof value === "string" ? value : "");

export const readSpecs = (json: Json): SpecRow[] =>
  Array.isArray(json) ? json.filter(isRecord).map((row) => ({ label: text(row.label), value: text(row.value) })).filter((row) => row.label) : [];

export const readFaq = (json: Json): Faq[] =>
  Array.isArray(json)
    ? json.filter(isRecord).map((row) => ({ question: text(row.question), answer: text(row.answer) })).filter((row) => row.question)
    : [];

function check<T>(result: { data: T | null; error: { message: string } | null }, what: string): T {
  if (result.error || !result.data) throw new Error(`Supabase: ${what} okunamadı: ${result.error?.message ?? "veri yok"}`);
  return result.data;
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const db = createPublicClient();
  const [categoryRows, groupRows, productRows, imageRows, downloadRows, settingRows, logoRows] = await Promise.all([
    db.from("categories").select("*").order("sort").order("title").then((r) => check(r, "kategoriler")),
    db.from("groups").select("*").order("sort").order("title").then((r) => check(r, "gruplar")),
    db.from("products").select("*").order("sort").order("name").then((r) => check(r, "ürünler")),
    db.from("product_images").select("*").order("sort").order("created_at").then((r) => check(r, "ürün görselleri")),
    db
      .from("downloads")
      .select("*")
      .order("release_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then((r) => check(r, "indirmeler")),
    db.from("site_settings").select("key, value").then((r) => check(r, "site metinleri")),
    db.from("reference_logos").select("*").order("sort").order("created_at").then((r) => check(r, "referans logoları")),
  ]);

  const imagesByProduct = new Map<string, ImageAsset[]>();
  for (const row of imageRows) {
    const list = imagesByProduct.get(row.product_id) ?? [];
    list.push({ src: mediaUrl(row.storage_path), width: row.width, height: row.height, alt: row.alt });
    imagesByProduct.set(row.product_id, list);
  }

  const productNames = new Map(productRows.map((row) => [row.id, { slug: row.slug, name: row.name }]));
  const allManuals: (Manual & { productId: string | null })[] = downloadRows.map((row) => ({
    id: row.id,
    title: row.title,
    model: row.model,
    version: row.version,
    date: formatDate(row.release_date),
    src: mediaUrl(row.storage_path),
    size: row.size_bytes,
    productId: row.product_id,
    product: row.product_id ? (productNames.get(row.product_id) ?? null) : null,
  }));

  const catalog: Category[] = [];
  const products: Product[] = [];
  for (const categoryRow of categoryRows) {
    const category: Category = { slug: categoryRow.slug, title: categoryRow.title, groups: [] };
    for (const groupRow of groupRows.filter((row) => row.category_id === categoryRow.id)) {
      const group: Group = { slug: groupRow.slug, title: groupRow.title, products: [] };
      for (const row of productRows.filter((p) => p.group_id === groupRow.id)) {
        const manual = allManuals.find((m) => m.productId === row.id) ?? null;
        const product: Product = {
          id: row.id,
          slug: row.slug,
          name: row.name,
          shortName: row.short_name || row.name,
          shortDescription: row.short_description,
          descriptionHtml: row.description_html,
          specs: readSpecs(row.specs),
          faqTitle: row.faq_title,
          faq: readFaq(row.faq),
          videos: row.videos,
          images: imagesByProduct.get(row.id) ?? [],
          seo: { title: row.seo_title, description: row.seo_description },
          manual,
          category: { slug: category.slug, title: category.title },
          group: { slug: group.slug, title: group.title },
        };
        group.products.push(product);
        products.push(product);
      }
      if (group.products.length > 0) category.groups.push(group);
    }
    if (category.groups.length > 0) catalog.push(category);
  }

  // İndirmeler: catalog order, newest version first; files of hidden products are left out.
  const visible = new Map(products.map((p, index) => [p.slug, index]));
  const manuals = allManuals
    .filter((m) => !m.product || visible.has(m.product.slug))
    .sort((a, b) => (a.product ? visible.get(a.product.slug)! : Infinity) - (b.product ? visible.get(b.product.slug)! : Infinity));

  const settings = readSettings(settingRows);
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return {
    catalog,
    products,
    product: (slug) => bySlug.get(slug),
    manuals,
    settings,
    contact: contactInfo(settings.contact),
    logos: logoRows.map((row) => ({ src: mediaUrl(row.storage_path), width: row.width, height: row.height, alt: row.name })),
  };
});

/** A settings image: the uploaded/static file, or else the given image of the product. */
export function settingImage(image: Settings["hero"]["slides"][number]["image"], product: Product | undefined): ImageAsset | undefined {
  if (image.src) return { src: image.src, width: image.width, height: image.height };
  return product?.images[image.productImage] ?? product?.images[0];
}
