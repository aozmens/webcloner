// Editable home page and corporate texts (site_settings table, one JSON document per key). The defaults are the
// texts the site launched with; they are used for any key or field missing from the database, and the import
// script writes them as the initial rows.
//
// Long texts are plain text: a blank line starts a new paragraph. "{yıl}" is replaced by the years of
// experience from the contact settings, so the number stays the same everywhere.

import kvkkJson from "./content/kvkk.json";
import type { IconName } from "./icons";
import { company } from "./company";
import { media, mediaByName } from "./media";

/** A slide image: an uploaded or static file (`src`), or else image number `productImage` of the slide's product. */
export type SettingImage = { src: string; width: number; height: number; productImage: number };

/**
 * A hero slide. `productSlug` is optional: a slide without a product needs its own image and title. With a product,
 * empty texts fall back to the product (name, first sentence of the short description, "İncele" to its page).
 */
export type HeroSlide = {
  productSlug: string;
  eyebrow: string;
  step: string;
  title: string;
  text: string;
  buttonLabel: string;
  /** "/iletisim" style site path or an https:// address. Empty: the product page, or no button without a product. */
  buttonHref: string;
  image: SettingImage;
  /** "contain" shows renders shot on white whole on a white slide instead of cropping them. */
  fit: string;
  /** CSS object-position for "cover" slides, e.g. "50% 45%". */
  position: string;
};

export type IconCard = { icon: IconName | string; title: string; text: string };

export type Settings = {
  hero: { slides: HeroSlide[] };
  reasons: { title: string; items: IconCard[] };
  strengths: { title: string; subtitle: string; heading: string; tagline: string; text: string; cards: IconCard[] };
  showcase: { title: string; text: string; items: { step: string; productSlug: string; productImage: number }[] };
  about: { eyebrow: string; title: string; intro: string; heading: string; body: string };
  services: { title: string; intro: string; tagline: string; cards: IconCard[]; consultTitle: string; consultText: string };
  kvkk: { title: string; body: string };
  contact: {
    phone: string;
    email: string;
    address: string;
    city: string;
    whatsapp: string;
    experienceYears: number;
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
  };
};

export type SettingKey = keyof Settings;
export const settingKeys = ["hero", "reasons", "strengths", "showcase", "about", "services", "kvkk", "contact"] as const satisfies readonly SettingKey[];

const file = (image: { src: string; width: number; height: number }): SettingImage => ({ ...image, productImage: 0 });
const productImage = (index: number): SettingImage => ({ src: "", width: 0, height: 0, productImage: index });
/** Texts taken from the slide's product. */
const fromProduct = { title: "", text: "", buttonLabel: "", buttonHref: "" };

const [kvkkTitle, ...kvkkBody] = kvkkJson as string[];

export const defaultSettings: Settings = {
  hero: {
    slides: [
      { productSlug: "ty-1000", eyebrow: "Spreyleme Üniteleri", step: "TY-1000", ...fromProduct, image: file(mediaByName(media.products, "deneme-15")), fit: "cover", position: "50% 45%" },
      { productSlug: "tru-13", eyebrow: "Robotik Uygulamalar", step: "TRU-13", ...fromProduct, image: file(mediaByName(media.home, "katalog-karakaya")), fit: "cover", position: "" },
      { productSlug: "ilc-cell", eyebrow: "Robotik Lazer Sistemleri", step: "iLC-Cell", ...fromProduct, image: productImage(0), fit: "contain", position: "" },
      { productSlug: "tk-5", eyebrow: "Otomatik Kepçe Sistemleri", step: "TK-5", ...fromProduct, image: productImage(1), fit: "contain", position: "" },
    ],
  },
  reasons: {
    title: "Neden TEKNOSEM?",
    items: [
      { icon: "box", title: "3D Özelleştirilmiş Üretim Çözümleri", text: "Fabrikanızda yapılan incelemeler sonrasında sizlere özel robotik hat çözümleri geliştirmekte." },
      {
        icon: "package-check",
        title: "Yedek Parça Teminatı",
        text: "Yedek parça teminatı, bir ürünün veya cihazın kullanımı sırasında meydana gelebilecek arızalar ya da aşınmalar için gerekli parçaların sağlanması sürecidir.",
      },
      { icon: "pen-tool", title: "İsteğe Özel Aksesuar Tasarımı", text: "Müşterilerimizin ihtiyaçları doğrultusunda özel imalat robot toolları geliştirmekteyiz." },
      {
        icon: "shield-check",
        title: "Üretici Firma Garantisi",
        text: "Teknosem olarak, üretici firma garantisi kapsamında müşterilerimize ürünlerimizin kalitesine ve dayanıklılığına dair güvence sunmaktayız.",
      },
    ],
  },
  strengths: {
    title: "Teknosem – Yüksek Teknoloji ile Geleceğe Yön Veriyoruz",
    subtitle: "{yıl} Yıllık Tecrübe ve İnovasyonun Gücüyle Yanınızdayız",
    heading: "TEKNOSEM",
    tagline: "Teknolojik Çözüm Ortağınız",
    text: "Kuruluşundan bu yana Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında faaliyet göstermektedir. Üretim ve yazılım süreçlerini kendi bünyesinde geliştirerek, müşterilerine anahtar teslim projeler sunmaktadır.",
    cards: [
      {
        icon: "flask-conical",
        title: "Yenilikçi ve Güçlü Ar-Ge Altyapısı",
        text: "Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında ileri düzey Ar-Ge çalışmaları yaparak, sektöre yenilikçi çözümler sunmaktadır.",
      },
      {
        icon: "key-round",
        title: "Anahtar Teslim Çözümler",
        text: "Üretim ve yazılım süreçlerini kendi bünyesinde geliştiren Teknosem, müşteri ihtiyaçlarına özel anahtar teslim projeler sunarak verimli ve entegre çözümler sağlar.",
      },
      {
        icon: "award",
        title: "{yıl} Yıllık Tecrübe ve Güven",
        text: "1994 yılından beri sektörde var olan Teknosem, güçlenerek gelen altyapısı ve deneyimli ekibi ile güvenilir, kaliteli ve yüksek performanslı ürünler üretmektedir.",
      },
    ],
  },
  showcase: {
    title: "Ürünlerimiz",
    text: "Robotik sistemlerimiz, akademik bilgi ve mühendislik uzmanlığıyla endüstriyel üretimden sağlığa kadar geniş bir kullanım alanı sunar.",
    items: [
      { step: "HPDC Robot Sistemleri", productSlug: "ty-700-multi-axis", productImage: 0 },
      { step: "Robotik Uygulamalar", productSlug: "robotik-polisaj", productImage: 1 },
      { step: "Yardımcı Ekipman ve Aksesuarlar", productSlug: "tnd-4", productImage: 0 },
    ],
  },
  about: {
    eyebrow: "TEKNOSEM",
    title: "Teknolojik Çözüm Ortağınız",
    intro:
      "Teknosem Test ve Analiz Cihazları Teknoloji Araştırma Sanayi Dış Ticaret A.Ş., 1994 yılında şahıs şirketi olarak kurulmuş ve üretime başlamıştır. Kuruluşundan bu yana Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında faaliyet göstermektedir. Üretim ve yazılım süreçlerini kendi bünyesinde geliştirerek, müşterilerine anahtar teslim projeler sunmaktadır. Bu sayede, sektörde güvenilir ve yenilikçi çözümler üreterek, kullanıcılarına en yüksek verimliliği ve kaliteyi sağlamaktadır.",
    heading: "Hakkımızda",
    body: [
      "Teknosem Test ve Analiz Cihazları Teknoloji Araştırma Sanayi Dış Ticaret A.Ş., 1994 yılında şahıs şirketi olarak kurulmuş ve üretime başlamıştır. 2006 yılında adını ve vizyonunu yenileyerek, hedeflerine ulaşmak için çalışmalarına hız kazandırmıştır. Güçlü altyapısı ve kurumsal kimliği ile sektördeki {yıl} yıllık tecrübesini kullanarak, Türkiye’de test ve analiz cihazları ile robotik otomasyon sistemleri alanında öncü adımlar atmaya devam etmektedir.",
      "Kuruluşundan bu yana Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında faaliyet göstermektedir. Üretim ve yazılım süreçlerini kendi bünyesinde geliştirerek, müşterilerine anahtar teslim projeler sunmaktadır. Bu sayede, sektörde güvenilir ve yenilikçi çözümler üreterek, kullanıcılarına en yüksek verimliliği ve kaliteyi sağlamaktadır.",
      "Özellikle HPDC Sistemleri başta olmak üzere, farklı enjeksiyon sistemlerine uygun yağlama ve otomatik dozajlama robotları üretmektedir. Bu sistemler, sanayi üretim süreçlerinde verimliliği artırırken, maliyetleri düşürmekte ve üretim hatlarında maksimum hassasiyet sağlamaktadır. Teknosem’in geliştirdiği robotik çözümler, üretim süreçlerini optimize ederken, işletmelere rekabet avantajı kazandırmaktadır.",
      "Tasarım ve üretim sürecinde, alanında uzman akademisyenler ve üniversitelerle yapılan iş birlikleri sayesinde üretilen sistemlerin bilimselliği ve güncelliği en üst seviyede tutulmaktadır. Teknosem, sadece teknolojiyi takip eden değil, yeni teknolojiler üreten bir firma olma vizyonuyla hareket etmekte ve insana, çevreye duyarlı üretim anlayışını benimsemektedir.",
      "Teknosem, Ar-Ge çalışmalarıyla sektöre yenilikçi çözümler sunmaya devam ederken, kaliteli, dayanıklı ve yüksek performanslı test cihazları ve robotik otomasyon sistemleri ile geleceğe yön vermeyi amaçlamaktadır. Müşteri odaklı yaklaşımı ve sürekli gelişim anlayışı ile sektördeki lider konumunu pekiştirerek, ulusal ve uluslararası arenada başarılarına yenilerini eklemektedir.",
    ].join("\n\n"),
  },
  services: {
    title: "Teknosem Robotik Hizmetleri",
    intro:
      "Teknosem olarak, robotik otomasyon sistemleri alanında yenilikçi ve güvenilir çözümler sunuyoruz. Üretim ve yazılım süreçlerini kendi bünyemizde geliştirerek, müşterilerimize yüksek kalite standartlarında hizmet sağlıyoruz.",
    tagline: "Verimliliği Artıran Akıllı Sistemler Teknosem’de!",
    cards: [
      {
        icon: "key-round",
        title: "Anahtar Teslim Projeler",
        text: "Müşterilerimizin ihtiyaçlarına özel olarak tasarlanan anahtar teslim projeler sunuyoruz. Üretim tesisleri için eksiksiz sistem entegrasyonu sağlayarak, verimli ve sorunsuz bir çalışma ortamı oluşturuyoruz.",
      },
      {
        icon: "wrench",
        title: "Teknik Servis ve Satış Sonrası Destek",
        text: "Ürünlerimizin uzun ömürlü ve sorunsuz çalışmasını sağlamak için kapsamlı teknik servis ve satış sonrası destek hizmeti sunuyoruz. Hızlı müdahale ve yerinde servis imkanlarımızla müşteri memnuniyetini en üst seviyede tutuyoruz.",
      },
      {
        icon: "package-check",
        title: "Yedek Parça Teminatı",
        text: "Garantisi Dolmuş olan cihazlarınızın yedek parçalarını firmamızdan temin edebilirsiniz. Garantisi Bitmeyen cihazlarımız için dışarıdan alıp takılan parçalar cihazınızı garanti dışı bırakır.",
      },
      {
        icon: "pen-tool",
        title: "İsteğe Özel Aksesuar Tasarımı",
        text: "Endüstriyel üretim süreçlerini hızlandırmak, maliyetleri azaltmak ve verimliliği artırmak amacıyla özelleştirilmiş robotik sistemleri tasarlayıp üretiyoruz.",
      },
    ],
    consultTitle: "Uzmanlarımıza Danışın",
    consultText: [
      "Her sorununuz için doğru çözümler sunan deneyimli ekibimiz yanınızda! İhtiyaç duyduğunuz tüm bilgileri, teknik destek ve ürün tavsiyelerini uzmanlarımızla görüşerek öğrenebilirsiniz.",
      "Teknik sorularınız, proje talepleriniz ya da danışmanlık ihtiyaçlarınız için hemen bizimle iletişime geçin! Uzmanlarımız, size en kısa sürede geri dönüş yaparak ihtiyaçlarınıza yönelik çözümler sunacaktır.",
    ].join("\n\n"),
  },
  kvkk: { title: kvkkTitle, body: kvkkBody.join("\n\n") },
  contact: {
    phone: company.phone,
    email: company.email,
    address: company.address,
    city: company.city,
    whatsapp: company.whatsapp,
    experienceYears: company.experienceYears,
    instagram: company.social.instagram,
    linkedin: company.social.linkedin,
    facebook: company.social.facebook,
    youtube: company.social.youtube,
  },
};

/* ------------------------------------------------------------------ reading stored values */

/** Same shape with every leaf emptied: the template for array items added in the panel. */
function blank<T>(template: T): T {
  if (Array.isArray(template)) return [] as T;
  if (template && typeof template === "object") {
    return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, blank(value)])) as T;
  }
  return (typeof template === "number" ? 0 : typeof template === "boolean" ? false : "") as T;
}

/** Coerces a stored JSON value to the template's shape: wrong or missing fields fall back to the template. */
function conform<T>(template: T, value: unknown): T {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return template;
    const item = template[0];
    if (item === undefined) return value.filter((entry) => typeof entry === "string") as T;
    return value.map((entry) => conform(blank(item), entry)) as T;
  }
  if (template && typeof template === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return template;
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.entries(template).map(([key, fallback]) => [key, key in record ? conform(fallback, record[key]) : fallback])) as T;
  }
  return (typeof value === typeof template ? value : template) as T;
}

export function readSettings(rows: { key: string; value: unknown }[]): Settings {
  const stored = new Map(rows.map((row) => [row.key, row.value]));
  return Object.fromEntries(settingKeys.map((key) => [key, stored.has(key) ? conform(defaultSettings[key], stored.get(key)) : defaultSettings[key]])) as Settings;
}

export const readSetting = <K extends SettingKey>(key: K, value: unknown): Settings[K] => conform(defaultSettings[key], value);

/* ------------------------------------------------------------------ helpers for rendering */

/** Splits a plain text at blank lines. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

export const withYears = (text: string, years: number) => text.replaceAll("{yıl}", String(years));

/** Slide button links may only point inside the site ("/iletisim") or to an http(s) address. */
export const isSafeHref = (href: string) => /^\/(?!\/)/.test(href) || /^https?:\/\/[^\s]+$/i.test(href);

/** Contact settings plus the links derived from them. */
export function contactInfo(contact: Settings["contact"]) {
  // Turkish numbers may be typed as "0 (216) ...", "216 ..." or "+90 216 ...".
  const digits = contact.phone.replace(/\D/g, "");
  const national = digits.length === 12 && digits.startsWith("90") ? digits.slice(2) : digits.replace(/^0/, "");
  const whatsappNumber = contact.whatsapp.replace(/\D/g, "");
  return {
    ...contact,
    phoneHref: `tel:+90${national}`,
    whatsappNumber,
    whatsappHref: `https://wa.me/${whatsappNumber}`,
    social: { instagram: contact.instagram, linkedin: contact.linkedin, facebook: contact.facebook, youtube: contact.youtube },
  };
}

export type ContactInfo = ReturnType<typeof contactInfo>;
