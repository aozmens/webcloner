// Per-product decisions layered on top of the exported content. PDF buttons, galleries and spec tables come
// from the data; anything listed here replaces it. Every entry has a matching item in
// docs/research/teknosem/TODO.md until the real material arrives.

import placeholdersJson from "./content/placeholders.json";

export type ManualInfo = {
  /** Model as printed on the manual cover. */
  model: string;
  /** Version shown on the site. */
  version: string;
  /** Date in the manual footer. */
  date: string;
  /** Set when the file name and the manual pages disagree; listed in TODO.md as "belirsiz". */
  uncertain?: string;
};

export type ProductOverride = {
  /** Replaces the exported manual list. An empty array hides the PDF button. */
  documents?: { name: string; src: string }[];
  /** What the PDF itself says (cover and page footer), checked file by file. */
  manual?: ManualInfo;
  /** Replaces the exported gallery. */
  images?: { src: string; width: number; height: number }[];
  /** Hides the "Teknik Detaylar" tab. */
  hideSpecs?: boolean;
  reason: string;
};

const placeholders = placeholdersJson as Record<string, { src: string; width: number; height: number }>;

export const productOverrides: Record<string, ProductOverride> = {
  // Manuals: model and version read from each PDF (cover + footer). Only files that exist in the archive are
  // published, one per product (each product has exactly one).
  "ty-700-multi-axis": {
    manual: { model: "TY-700 Multi Axis", version: "V1.1", date: "14.03.2025" },
    reason: "Kılavuz kapağı: TY-700 Multi axis, alt bilgi: V1.1 – 14.03.2025.",
  },
  "ty-700": {
    manual: { model: "TY-700", version: "V1.3", date: "06.05.2025" },
    reason: "Kılavuz kapağı: TY-700, alt bilgi: V1.3 – 06.05.2025.",
  },
  "ty-1000": {
    manual: { model: "TY-1000", version: "V1.12", date: "09.05.2025" },
    reason: "Kılavuz kapağı: TY-1000, alt bilgi: V1.12 – 09.05.2025. Güncel sürüm teyidi bekleniyor.",
  },
  "vakusem-a-2004": {
    manual: { model: "VAKUSEM A-2004", version: "V1.1", date: "14.03.2025" },
    reason: "Kılavuz kapağı: Vakusem A-2004, alt bilgi: V1.1 – 14.03.2025.",
  },
  "vakusem-a-1001": {
    manual: {
      model: "VAKUSEM A-1001",
      version: "V1.11",
      date: "14.03.2025",
      uncertain: "Dosya adı A-1001_V1.11, kılavuzun tüm sayfalarında V1.1 yazıyor.",
    },
    reason: "V1.12 dosyası gelene kadar elimizdeki tek dosya (A-1001_V1.11) listeleniyor.",
  },
  "tk-5": {
    manual: { model: "TK-5", version: "V1.5", date: "14.03.2025" },
    reason: "TK-5 klasöründeki kılavuz (50 sayfa); kapakta TK-5, metinde TK-7 geçmiyor.",
  },
  "tk-7": {
    documents: [],
    reason:
      "TK-7 klasöründeki TK-5_V1.5.pdf (46 sayfa) kapakta TK-5 diyor, TK-7 hiç geçmiyor ve elektrik şemaları TK-5 klasöründekinden farklı; model belirsiz, yayınlanmıyor.",
  },
  "ty-2000": {
    images: [placeholders["ty-2000"]],
    reason: "Kaynaktaki 6 görsel TY-1000 dosyalarıydı (üzerinde TY-1000 yazıyor); gerçek görseller gelene kadar geçici görsel.",
  },
  "tru-50-1": {
    hideSpecs: true,
    reason: "Kaynaktaki teknik tablo TY-700 değerlerini içeriyordu; doğru değerler gelene kadar gizli.",
  },
};
