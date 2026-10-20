// Teknosem content layer. Raw data comes from docs/teknosem-icerik via scripts/teknosem/build-content.mjs;
// every correction applied on top of it is listed in `corrections` so it stays reviewable.

import mediaJson from "./content/media.json";
import productsJson from "./content/products.json";

export type ImageAsset = { src: string; width: number; height: number };
export type ProductTab = { title: string; markdown: string; videos: string[] };
export type Product = {
  no: number;
  slug: string;
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

/** Obvious copy/paste errors in the source content: wrong model names and typos. */
const corrections: Record<string, [string, string][]> = {
  "ty-700-multi-axis-spreyleme-unitesi": [["TY-1000, her döküm", "TY-700 Multi Axis, her döküm"]],
  "ty-700-spreyleme-unitesi": [["TY-1000, her döküm", "TY-700, her döküm"]],
  "ty-2000-spreyleme-unitesi": [["TY-1000, her döküm", "TY-2000, her döküm"]],
  "tgm-2000-zimpara-makinesi": [["TGM-1000 modeli", "TGM-2000 modeli"]],
  "tpm-1000-polisaj-makinesi": [["TGM-1000 Polisaj Makinesi", "TPM-1000 Polisaj Makinesi"]],
};

function correct(slug: string, text: string) {
  return (corrections[slug] ?? []).reduce((value, [from, to]) => value.split(from).join(to), text);
}

export const products: Product[] = (productsJson as Product[]).map((product) => ({
  ...product,
  shortDescription: correct(product.slug, product.shortDescription),
}));

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

// Phase 1 ships only the home page, so product and corporate links still open teknosem.com.tr.
export const productHref = (p: Product) => p.sourceUrl;

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
      { title: "Spreyleme Üniteleri", slugs: ["ty-700-multi-axis-spreyleme-unitesi", "ty-700-spreyleme-unitesi", "ty-1000", "ty-2000-spreyleme-unitesi"] },
      {
        title: "Robotik Parça Alma/Spreyleme Sistemleri",
        slugs: ["tru-50-1-parca-alma-uygulamasity-700", "tru-50-2-parca-alma-ve-spreyleme-uygulamasi", "tru-50-3-parca-alma-spreyleme-ve-insert-uygulamasi"],
      },
      { title: "Otomatik Kepçe Sistemleri", slugs: ["tk-5", "teknosem-tk-7-otomatik-kepce-kopya"] },
      { title: "Kalıp Vakum Sistemleri", slugs: ["a-1001", "vakusem-a-2004"] },
    ],
  },
  {
    title: "Robotik Uygulamalar",
    href: `${SOURCE_ORIGIN}/robotik/urunler-teknosem/?urun-kategorisi=robotik-uygulamalar`,
    groups: [
      {
        title: "Robotik Lazer Sistemleri",
        slugs: [
          "ilw-cell-hucre-tipi-robotik-lazer-kaynak-sistemi",
          "ilw-desk-masa-tipi-lazer-kaynak",
          "ilc-cell-hucre-tip-robotik-lazer-sistemi",
          "ilc-desk-6-ekseni-robotik-lazer-kesim-sistemi",
        ],
      },
      { title: "Robotik Uygulamalar", slugs: ["tru-13-robotik-batarya-askilama-hucresi", "tpu-8-robotik-polisaj-uygulamasi", "robotik-zimpara-sistemi"] },
    ],
  },
  {
    title: "Yardımcı Ekipman ve Aksesuarlar",
    href: `${SOURCE_ORIGIN}/robotik/urunler/?urun-kategorisi=yardimci-ekipman-ve-aksesuarlar`,
    groups: [
      {
        title: "Yardımcı Ekipman ve Aksesuarlar",
        slugs: [
          "spreyleme-makinesi-nozzle-basliginizi-siz-olusturun",
          "tnd-4-spreyleme-makinesi-doner-govde-nozzle-basligi",
          "ozel-tasarim-spreyleme-makinesi-nozzle-basligi",
          "tnh-103-spreyleme-makinesi-nozzle-basligi",
          "tnh-52-spreyleme-makinesi-nozzle-basligi",
        ],
      },
      {
        title: "",
        slugs: [
          "tnh-28-spreyleme-makinesi-nozzle-basligi",
          "tnh-14-spreyleme-makinesi-nozzle-basligi",
          "tgm-2000-zimpara-makinesi",
          "tgm-1000-double-task-zimpara-makinesi",
          "tgm-1000-zimpara-makinesi",
          "tpm-1000-polisaj-makinesi",
        ],
      },
    ],
  },
];

export const corporateLinks = [pages.about, pages.services, pages.references, pages.downloads, pages.contact, pages.careers, pages.service, pages.kvkk];
