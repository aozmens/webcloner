// Teknosem content layer. Raw data comes from docs/teknosem-icerik via scripts/teknosem/build-content.mjs;
// every correction applied on top of it is listed in `corrections` so it stays reviewable.

import mediaJson from "./content/media.json";
import productsJson from "./content/products.json";
import { catalog, shortNames, type CatalogCategory, type CatalogGroup } from "./catalog";
import { productOverrides, type ManualInfo } from "./product-overrides";
import { productSlugs } from "./slugs";

export { company, corporateLinks, pageHref, pages, SOURCE_ORIGIN, type PageKey } from "./company";

export type Manual = ManualInfo & { name: string; src: string };
export type ImageAsset = { src: string; width: number; height: number };
export type ProductTab = { title: string; markdown: string; videos: string[] };
export type Product = {
  no: number;
  /** Clean URL segment: /urun/<slug>. */
  slug: string;
  /** Slug of the old teknosem.com.tr/robotik/urun/<sourceSlug>/ page. */
  sourceSlug: string;
  name: string;
  categories: string[];
  sourceUrl: string;
  shortDescription: string;
  tabs: ProductTab[];
  videos: string[];
  images: ImageAsset[];
  documents: Manual[];
  seo: { title: string; description: string };
};


/** Obvious copy/paste errors in the source content (wrong model names), keyed by clean slug. */
const corrections: Record<string, [string, string][]> = {
  "ty-700-multi-axis": [["TY-1000, her döküm", "TY-700 Multi Axis, her döküm"]],
  "ty-700": [
    ["TY-1000, her döküm", "TY-700, her döküm"],
    ["TY-1000 Kalıp Yağlama Sistemi", "TY-700 Kalıp Yağlama Sistemi"],
    ["sayesinde, TY-1000 üretim hızını", "sayesinde, TY-700 üretim hızını"],
  ],
  "ty-2000": [
    ["TY-1000, her döküm", "TY-2000, her döküm"],
    ["TY-1000, dinamik hatları", "TY-2000, dinamik hatları"],
    ["TY-1000 Kalıp Yağlama Sistemi", "TY-2000 Kalıp Yağlama Sistemi"],
  ],
  "tgm-2000": [["TGM-1000 modeli", "TGM-2000 modeli"]],
  "tpm-1000": [["TGM-1000 Polisaj Makinesi", "TPM-1000 Polisaj Makinesi"]],
};

function correct(slug: string, text: string) {
  return (corrections[slug] ?? []).reduce((value, [from, to]) => value.split(from).join(to), text);
}

type RawProduct = Omit<Product, "sourceSlug" | "documents"> & { documents: { name: string; src: string }[] };

export const products: Product[] = (productsJson as RawProduct[]).map((raw) => {
  const slug = productSlugs[raw.slug];
  if (!slug) throw new Error(`No clean URL for Teknosem product: ${raw.slug}`);
  const override = productOverrides[slug];
  const images = override?.images ?? raw.images;
  const documents = override?.documents ?? raw.documents;
  return {
    ...raw,
    slug,
    sourceSlug: raw.slug,
    shortDescription: correct(slug, raw.shortDescription),
    tabs: raw.tabs
      .filter((tab, index) => !(override?.hideSpecs && index === 1))
      .map((tab) => ({ ...tab, markdown: correct(slug, tab.markdown) })),
    images: images.map((image) => ({ ...image, src: image.src })),
    documents: documents.map((doc) => {
      // Every published manual must have its model and version confirmed from the PDF itself.
      if (!override?.manual) throw new Error(`Manual of ${slug} has no confirmed model/version in product-overrides.ts`);
      return { ...doc, ...override.manual, src: doc.src };
    }),
    seo: { ...raw.seo, description: correct(slug, raw.seo.description) },
  };
});

export const media = mediaJson as Record<
  "home" | "about" | "contact" | "products" | "references",
  ImageAsset[]
>;

export function product(slug: string): Product {
  const found = products.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown Teknosem product: ${slug}`);
  return found;
}

export const shortName = (p: Product) => shortNames[p.slug] ?? p.name;

/**
 * İndirmeler list, derived from the product data so it only links to files that exist and follows the
 * per-product decisions (e.g. TY-1000 → TY-1000_V1.12, no TK-5 manual under TK-7).
 */
export const manuals = products.flatMap((p) => p.documents.map((doc) => ({ ...doc, product: p })));

/** First sentence of a text, used where the layout only has room for a lead sentence. */
export function leadSentence(text: string) {
  const match = text.trim().match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

export const productHref = (p: Product) => `/urun/${p.slug}`;
export const productsHref = "/urunler";
export const categoryHref = (category: CatalogCategory, group?: CatalogGroup) =>
  `/urunler/${category.slug}${group ? `#${group.slug}` : ""}`;

export { catalog };
export type { CatalogCategory, CatalogGroup };

export const categoryBySlug = (slug: string) => catalog.find((category) => category.slug === slug);

/** Where a product sits in the catalog, plus the other products of its group. */
export function productPlacement(slug: string) {
  for (const category of catalog) {
    const group = category.groups.find((g) => g.products.includes(slug));
    if (group) return { category, group, siblings: group.products.filter((s) => s !== slug).map(product) };
  }
  throw new Error(`Teknosem product is missing from the catalog: ${slug}`);
}

// Every product must appear exactly once in the catalog, so menus and /urunler never drop one.
const listed = catalog.flatMap((category) => category.groups.flatMap((group) => group.products));
for (const p of products) {
  if (listed.filter((slug) => slug === p.slug).length !== 1) throw new Error(`Catalog must list ${p.slug} exactly once`);
}
