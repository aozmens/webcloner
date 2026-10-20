// Company facts and page links. No data imports, so client components can use it without pulling in the
// product content.

import { withBase } from "./site-config";

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
  whatsappNumber: "905458290652",
  whatsappHref: "https://wa.me/905458290652",
  social: {
    instagram: "https://www.instagram.com/teknosem.a.s/",
    linkedin: "https://www.linkedin.com/company/teknosemofficial/posts/?feedView=all",
    facebook: "https://www.facebook.com/TeknosemTest/",
    youtube: "https://www.youtube.com/@TeknosemTest",
  },
};

/** Corporate pages, keyed by the route they live on. `legacy` lists the old WordPress paths (under /robotik). */
export const pages = {
  about: { label: "Hakkımızda", path: "/hakkimizda", legacy: ["/kurumsal-teknosem", "/en/kurumsal-teknosem"] },
  contact: { label: "İletişim", path: "/iletisim", legacy: ["/iletisim-teknosem"] },
  quote: { label: "Teklif Al", path: "/teklif-al", legacy: ["/teklif-al-teknosem", "/teklif-al"] },
  services: { label: "Hizmetler", path: "/hizmetler", legacy: ["/hizmetler-teknosem"] },
  kvkk: { label: "Kişisel Verilerin Korunması Kanunu (KVKK)", path: "/kvkk", legacy: ["/kisisel-verilerin-korunmasi-kanunu-kvkk-te"] },
  references: { label: "Referanslar", path: "/referanslar", legacy: ["/referanslar-teknosem"] },
  careers: { label: "İnsan Kaynakları", path: "/insan-kaynaklari", legacy: ["/insan-kaynaklari-teknosem"] },
  service: { label: "Servis Talebi", path: "/servis-talebi", legacy: ["/servis-talebi-teknosem"] },
  downloads: { label: "İndirmeler", path: "/indirmeler", legacy: ["/indirmeler-teknosem", "/indirmeler/:file"] },
} as const;

export type PageKey = keyof typeof pages;

export const pageHref = (key: PageKey) => withBase(pages[key].path);

export const corporateLinks = (["about", "services", "references", "downloads", "contact", "careers", "service", "kvkk"] as const).map((key) => ({
  label: pages[key].label,
  href: pageHref(key),
}));
