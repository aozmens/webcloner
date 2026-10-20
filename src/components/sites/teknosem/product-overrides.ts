// Per-product decisions layered on top of the exported content. PDF buttons, galleries and spec tables come
// from the data; anything listed here replaces it. Every entry has a matching item in
// docs/research/teknosem/TODO.md until the real material arrives.

import placeholdersJson from "./content/placeholders.json";

export type ProductOverride = {
  /** Replaces the exported manual list. An empty array hides the PDF button. */
  documents?: { name: string; src: string }[];
  /** Replaces the exported gallery. */
  images?: { src: string; width: number; height: number }[];
  /** Hides the "Teknik Detaylar" tab. */
  hideSpecs?: boolean;
  reason: string;
};

const placeholders = placeholdersJson as Record<string, { src: string; width: number; height: number }>;

export const productOverrides: Record<string, ProductOverride> = {
  "tk-7": {
    documents: [],
    reason: "Kaynakta TK-7 sayfasında TK-5_V1.5.pdf vardı; TK-7 kılavuzu gelene kadar buton gösterilmiyor.",
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
