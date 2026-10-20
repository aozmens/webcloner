// Product catalog structure: the single source for the mega menu, the mobile accordion, /urunler pages,
// the footer, search labels and the legacy category redirects. Pure data (no imports) so next.config.ts
// can read it. Category and group slugs reuse the old WordPress "urun-kategorisi" slugs where one existed.

export type CatalogGroup = { slug: string; title: string; products: string[] };
export type CatalogCategory = { slug: string; title: string; groups: CatalogGroup[] };

export const catalog: CatalogCategory[] = [
  {
    slug: "hpdc-robot-sistemleri",
    title: "HPDC Robot Sistemleri",
    groups: [
      { slug: "spreyleme-uniteleri", title: "Spreyleme Üniteleri", products: ["ty-700-multi-axis", "ty-700", "ty-1000", "ty-2000"] },
      { slug: "robotik-parca-alma-spreyleme-sistemleri", title: "Parça Alma/Spreyleme", products: ["tru-50-1", "tru-50-2", "tru-50-3"] },
      { slug: "otomatik-kepce-sistemleri", title: "Otomatik Kepçe", products: ["tk-5", "tk-7"] },
      { slug: "kalip-vakum-sistemleri", title: "Kalıp Vakum", products: ["vakusem-a-1001", "vakusem-a-2004"] },
    ],
  },
  {
    slug: "robotik-uygulamalar",
    title: "Robotik Uygulamalar",
    groups: [
      { slug: "robotik-lazer-sistemleri", title: "Lazer Sistemleri", products: ["ilw-cell", "ilw-desk", "ilc-cell", "ilc-desk"] },
      { slug: "tru-13", title: "TRU-13", products: ["tru-13"] },
      { slug: "robotik-polisaj", title: "Robotik Polisaj", products: ["robotik-polisaj"] },
      { slug: "robotik-zimpara", title: "Robotik Zımpara", products: ["robotik-zimpara"] },
    ],
  },
  {
    slug: "yardimci-ekipman-ve-aksesuarlar",
    title: "Yardımcı Ekipman ve Aksesuarlar",
    groups: [
      {
        slug: "nozzle-basliklari",
        title: "Nozzle Başlıkları",
        products: ["nozzle-basliginizi-siz-olusturun", "tnd-4", "ozel-tasarim-nozzle-basligi", "tnh-103", "tnh-52", "tnh-28", "tnh-14"],
      },
      { slug: "zimpara-ve-polisaj-makineleri", title: "Zımpara ve Polisaj Makineleri", products: ["tgm-2000", "tgm-1000-double-task", "tgm-1000", "tpm-1000"] },
    ],
  },
];

/** Short display names for compact lists (menu, /urunler cards), taken from the product names. */
export const shortNames: Record<string, string> = {
  "ty-700-multi-axis": "TY-700 Multi Axis",
  "ty-700": "TY-700",
  "ty-1000": "TY-1000",
  "ty-2000": "TY-2000",
  "tru-50-1": "TRU-50-1",
  "tru-50-2": "TRU-50-2",
  "tru-50-3": "TRU-50-3",
  "tk-5": "TK-5",
  "tk-7": "TK-7",
  "vakusem-a-1001": "VAKUSEM A-1001",
  "vakusem-a-2004": "VAKUSEM A-2004",
  "ilw-cell": "iLW-Cell",
  "ilw-desk": "iLW-Desk",
  "ilc-cell": "iLC-Cell",
  "ilc-desk": "iLC-Desk",
  "tru-13": "TRU-13",
  "robotik-polisaj": "Robotik Polisaj",
  "robotik-zimpara": "Robotik Zımpara",
  "nozzle-basliginizi-siz-olusturun": "Nozzle Başlığınızı Siz Oluşturun",
  "tnd-4": "TND-4",
  "ozel-tasarim-nozzle-basligi": "Özel Tasarım Nozzle Başlığı",
  "tnh-103": "TNH-103",
  "tnh-52": "TNH-52",
  "tnh-28": "TNH-28",
  "tnh-14": "TNH-14",
  "tgm-2000": "TGM-2000",
  "tgm-1000-double-task": "TGM-1000 Double Task",
  "tgm-1000": "TGM-1000",
  "tpm-1000": "TPM-1000",
};

/** Old WordPress category URLs ("urun-kategorisi" paths, as linked from product pages) → new catalog place. */
export const legacyCategoryPaths: Record<string, { category: string; group?: string }> = {
  "hpdc-robot-sistemleri": { category: "hpdc-robot-sistemleri" },
  "hpdc-robot-sistemleri/spreyleme-uniteleri": { category: "hpdc-robot-sistemleri", group: "spreyleme-uniteleri" },
  "hpdc-robot-sistemleri/robotik-parca-alma-spreyleme-sistemleri": { category: "hpdc-robot-sistemleri", group: "robotik-parca-alma-spreyleme-sistemleri" },
  "hpdc-robot-sistemleri/otomatik-kepce-sistemleri": { category: "hpdc-robot-sistemleri", group: "otomatik-kepce-sistemleri" },
  "hpdc-robot-sistemleri/kalip-vakum-sistemleri": { category: "hpdc-robot-sistemleri", group: "kalip-vakum-sistemleri" },
  "robotik-lazer-sistemleri": { category: "robotik-uygulamalar", group: "robotik-lazer-sistemleri" },
  "robotik-uygulamalar": { category: "robotik-uygulamalar" },
  "yardimci-ekipman-ve-aksesuarlar": { category: "yardimci-ekipman-ve-aksesuarlar" },
};
