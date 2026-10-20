// Company facts and page links. No data imports, so client components can use it without pulling in the
// product content.

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

export const corporateLinks = [pages.about, pages.services, pages.references, pages.downloads, pages.contact, pages.careers, pages.service, pages.kvkk];
