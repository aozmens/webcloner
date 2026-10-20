// Clean product URLs (/urun/<short>) keyed by the slug of the old teknosem.com.tr/robotik/urun/<slug>/ page.
// Kept dependency-free so next.config.ts can build the 301 redirect table from it.

export const productSlugs: Record<string, string> = {
  "ilw-cell-hucre-tipi-robotik-lazer-kaynak-sistemi": "ilw-cell",
  "ilw-desk-masa-tipi-lazer-kaynak": "ilw-desk",
  "ilc-cell-hucre-tip-robotik-lazer-sistemi": "ilc-cell",
  "ilc-desk-6-ekseni-robotik-lazer-kesim-sistemi": "ilc-desk",
  "ty-700-multi-axis-spreyleme-unitesi": "ty-700-multi-axis",
  "spreyleme-makinesi-nozzle-basliginizi-siz-olusturun": "nozzle-basliginizi-siz-olusturun",
  "tnd-4-spreyleme-makinesi-doner-govde-nozzle-basligi": "tnd-4",
  "ozel-tasarim-spreyleme-makinesi-nozzle-basligi": "ozel-tasarim-nozzle-basligi",
  "tnh-103-spreyleme-makinesi-nozzle-basligi": "tnh-103",
  "tnh-52-spreyleme-makinesi-nozzle-basligi": "tnh-52",
  "tnh-28-spreyleme-makinesi-nozzle-basligi": "tnh-28",
  "tnh-14-spreyleme-makinesi-nozzle-basligi": "tnh-14",
  "tgm-2000-zimpara-makinesi": "tgm-2000",
  "tgm-1000-double-task-zimpara-makinesi": "tgm-1000-double-task",
  "tru-13-robotik-batarya-askilama-hucresi": "tru-13",
  "vakusem-a-2004": "vakusem-a-2004",
  "ty-700-spreyleme-unitesi": "ty-700",
  "ty-2000-spreyleme-unitesi": "ty-2000",
  "tru-50-3-parca-alma-spreyleme-ve-insert-uygulamasi": "tru-50-3",
  "tru-50-2-parca-alma-ve-spreyleme-uygulamasi": "tru-50-2",
  "teknosem-tk-7-otomatik-kepce-kopya": "tk-7",
  "tpm-1000-polisaj-makinesi": "tpm-1000",
  "tgm-1000-zimpara-makinesi": "tgm-1000",
  "tpu-8-robotik-polisaj-uygulamasi": "robotik-polisaj",
  "robotik-zimpara-sistemi": "robotik-zimpara",
  "tru-50-1-parca-alma-uygulamasity-700": "tru-50-1",
  "tk-5": "tk-5",
  "ty-1000": "ty-1000",
  "a-1001": "vakusem-a-1001",
};

/** 301 redirects from the old WordPress product URLs to the clean ones. */
export function productRedirects() {
  return Object.entries(productSlugs).flatMap(([oldSlug, slug]) =>
    [`/robotik/urun/${oldSlug}`, `/robotik/urun/${oldSlug}/`].map((source) => ({ source, destination: `/urun/${slug}`, statusCode: 301 as const })),
  );
}
