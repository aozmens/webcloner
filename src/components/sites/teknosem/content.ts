// Teknosem content layer. Raw data comes from docs/teknosem-icerik via scripts/teknosem/build-content.mjs;
// every correction applied on top of it is listed in `corrections` so it stays reviewable.

import mediaJson from "./content/media.json";
import productsJson from "./content/products.json";
import { productSlugs } from "./slugs";

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
  documents: { name: string; src: string }[];
  seo: { title: string; description: string };
};

export const SOURCE_ORIGIN = "https://teknosem.com.tr";

export const company = {
  name: "Teknosem",
  legalName: "Teknosem Test ve Analiz Cihazları Teknoloji Araştırma Sanayi Dış Ticaret A.Ş.",
  phone: "0 (216) 421 25 95",
  phoneHref: "tel:+902164212595",
  email: "info@teknosem.com.tr",
  address: "Mescit Mh. Demokrasi Cd. No:3 Birmes Sanayi Sit. D2 Blok No:4 Tuzla-İSTANBUL",
  city: "Tuzla-İSTANBUL",
  whatsapp: "+90 545 829 06 52",
  whatsappHref: "https://wa.me/905458290652",
  social: {
    instagram: "https://www.instagram.com/teknosem.a.s/",
    linkedin: "https://www.linkedin.com/company/teknosemofficial/posts/?feedView=all",
    facebook: "https://www.facebook.com/TeknosemTest/",
    youtube: "https://www.youtube.com/@TeknosemTest",
  },
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

type RawProduct = Omit<Product, "sourceSlug">;

export const products: Product[] = (productsJson as RawProduct[]).map((raw) => {
  const slug = productSlugs[raw.slug];
  if (!slug) throw new Error(`No clean URL for Teknosem product: ${raw.slug}`);
  return {
    ...raw,
    slug,
    sourceSlug: raw.slug,
    shortDescription: correct(slug, raw.shortDescription),
    tabs: raw.tabs.map((tab) => ({ ...tab, markdown: correct(slug, tab.markdown) })),
    seo: { ...raw.seo, description: correct(slug, raw.seo.description) },
  };
});

export const media = mediaJson as Record<"home" | "about" | "contact" | "products" | "references", ImageAsset[]>;

export function product(slug: string): Product {
  const found = products.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown Teknosem product: ${slug}`);
  return found;
}

/** First sentence of a text, used where the layout only has room for a lead sentence. */
export function leadSentence(text: string) {
  const match = text.trim().match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

export const productHref = (p: Product) => `/urun/${p.slug}`;

/** Corporate pages are built in phase 3; until then these links still open teknosem.com.tr. */

export const pages = {
  about: { label: "Hakkımızda", href: `${SOURCE_ORIGIN}/robotik/kurumsal-teknosem/` },
  contact: { label: "İletişim", href: `${SOURCE_ORIGIN}/robotik/iletisim-teknosem/` },
  quote: { label: "Teklif Al", href: `${SOURCE_ORIGIN}/robotik/teklif-al-teknosem/` },
  services: { label: "Hizmetler", href: `${SOURCE_ORIGIN}/robotik/hizmetler-teknosem/` },
  kvkk: { label: "Kişisel Verilerin Korunması Kanunu (KVKK)", href: `${SOURCE_ORIGIN}/robotik/kisisel-verilerin-korunmasi-kanunu-kvkk-te/` },
  references: { label: "Referanslar", href: `${SOURCE_ORIGIN}/robotik/referanslar-teknosem/` },
  careers: { label: "İnsan Kaynakları", href: `${SOURCE_ORIGIN}/robotik/insan-kaynaklari-teknosem/` },
  service: { label: "Servis Talebi", href: `${SOURCE_ORIGIN}/robotik/servis-talebi-teknosem/` },
  downloads: { label: "İndirmeler", href: `${SOURCE_ORIGIN}/robotik/indirmeler-teknosem/` },
};

export type ProductGroup = { title: string; slugs: string[] };
export type Category = { title: string; href: string; groups: ProductGroup[] };

/** Navigation tree. Group titles are the product categories from 00_Urun_Listesi.csv. */
export const categories: Category[] = [
  {
    title: "HPDC Robot Sistemleri",
    href: `${SOURCE_ORIGIN}/robotik/urunler/?urun-kategorisi=hpdc-robot-sistemleri`,
    groups: [
      { title: "Spreyleme Üniteleri", slugs: ["ty-700-multi-axis", "ty-700", "ty-1000", "ty-2000"] },
      {
        title: "Robotik Parça Alma/Spreyleme Sistemleri",
        slugs: ["tru-50-1", "tru-50-2", "tru-50-3"],
      },
      { title: "Otomatik Kepçe Sistemleri", slugs: ["tk-5", "tk-7"] },
      { title: "Kalıp Vakum Sistemleri", slugs: ["vakusem-a-1001", "vakusem-a-2004"] },
    ],
  },
  {
    title: "Robotik Uygulamalar",
    href: `${SOURCE_ORIGIN}/robotik/urunler-teknosem/?urun-kategorisi=robotik-uygulamalar`,
    groups: [
      {
        title: "Robotik Lazer Sistemleri",
        slugs: [
          "ilw-cell",
          "ilw-desk",
          "ilc-cell",
          "ilc-desk",
        ],
      },
      { title: "Robotik Uygulamalar", slugs: ["tru-13", "robotik-polisaj", "robotik-zimpara"] },
    ],
  },
  {
    title: "Yardımcı Ekipman ve Aksesuarlar",
    href: `${SOURCE_ORIGIN}/robotik/urunler/?urun-kategorisi=yardimci-ekipman-ve-aksesuarlar`,
    groups: [
      {
        title: "Yardımcı Ekipman ve Aksesuarlar",
        slugs: [
          "nozzle-basliginizi-siz-olusturun",
          "tnd-4",
          "ozel-tasarim-nozzle-basligi",
          "tnh-103",
          "tnh-52",
        ],
      },
      {
        title: "",
        slugs: [
          "tnh-28",
          "tnh-14",
          "tgm-2000",
          "tgm-1000-double-task",
          "tgm-1000",
          "tpm-1000",
        ],
      },
    ],
  },
];

export const corporateLinks = [pages.about, pages.services, pages.references, pages.downloads, pages.contact, pages.careers, pages.service, pages.kvkk];

/** Where a product sits in the navigation tree, plus the other products of its group. */
export function productPlacement(slug: string) {
  for (const category of categories) {
    // Untitled groups continue the previous group (desktop column split), so they count as one group.
    const merged = category.groups.reduce<ProductGroup[]>((list, group) => {
      const last = list[list.length - 1];
      if (!group.title && last) list[list.length - 1] = { ...last, slugs: [...last.slugs, ...group.slugs] };
      else list.push(group);
      return list;
    }, []);
    const group = merged.find((g) => g.slugs.includes(slug));
    if (group) return { category, group, siblings: group.slugs.filter((s) => s !== slug).map(product) };
  }
  throw new Error(`Teknosem product is missing from the navigation: ${slug}`);
}
