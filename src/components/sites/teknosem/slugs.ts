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

/** English product pages that did not use /en/urun/<same slug>/ on the old site. */
const englishPathOverrides: Record<string, string> = {
  "robotik-zimpara-sistemi": "/en/urun-zimpara-sistemi",
};

type Redirect = {
  source: string;
  destination: string;
  statusCode: 301;
  has?: { type: "query"; key: string; value: string }[];
};

/**
 * 301 table from the old teknosem.com.tr/robotik URLs to the new routes.
 * Sources and destinations are relative to this app; Next prefixes both with basePath. When the app itself is
 * served under the old prefix (basePath "/robotik"), the old paths lose that prefix and identical paths are skipped.
 */
export function legacyRedirects({ basePath, legacyBase, catalog, legacyCategoryPaths, pages }: {
  basePath: string;
  legacyBase: string;
  catalog: { slug: string }[];
  legacyCategoryPaths: Record<string, { category: string; group?: string }>;
  pages: { path: string; legacy: readonly string[] }[];
}): Redirect[] {
  const prefix = basePath === legacyBase ? "" : legacyBase;
  const redirects: Redirect[] = [];
  const add = (path: string, destination: string, has?: Redirect["has"]) => {
    for (const source of [path, `${path}/`]) {
      if (source.replace(/\/$/, "") === destination && !has) continue;
      redirects.push({ source, destination, statusCode: 301, ...(has ? { has } : {}) });
    }
  };

  // Category filters on the old listing pages come first: their path alone would otherwise match /urunler.
  for (const listing of ["/urunler", "/urunler-teknosem"]) {
    for (const category of catalog) {
      add(`${prefix}${listing}`, `/urunler/${category.slug}`, [{ type: "query", key: "urun-kategorisi", value: category.slug }]);
    }
    add(`${prefix}${listing}`, "/urunler");
  }
  add(`${prefix}/kurumsal-teknosem-2`, "/urunler");

  for (const [legacyPath, place] of Object.entries(legacyCategoryPaths)) {
    add(`${prefix}/urun-kategorisi/${legacyPath}`, `/urunler/${place.category}${place.group ? `#${place.group}` : ""}`);
  }

  // Old home page (only when the app is not itself served under the old prefix).
  if (prefix) add(prefix, "/");

  for (const page of pages) {
    for (const legacyPath of page.legacy) add(`${prefix}${legacyPath}`, page.path);
  }

  for (const [oldSlug, slug] of Object.entries(productSlugs)) {
    add(`${prefix}/urun/${oldSlug}`, `/urun/${slug}`);
    add(`${prefix}${englishPathOverrides[oldSlug] ?? `/en/urun/${oldSlug}`}`, `/urun/${slug}`);
  }
  return redirects;
}
