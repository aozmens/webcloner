// URL helpers and small text helpers shared by the site and the panel. No data imports.

export { pageHref, pages, corporateLinks, type PageKey } from "./company";

export const productsHref = "/urunler";
export const productHref = (product: { slug: string }) => `/urun/${product.slug}`;
export const categoryHref = (category: { slug: string }, group?: { slug: string }) =>
  `/urunler/${category.slug}${group ? `#${group.slug}` : ""}`;

/** First sentence of a text, used where the layout only has room for a lead sentence. */
export function leadSentence(text: string) {
  const match = text.trim().match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

/** "12.3 MB" in Turkish number format. */
export const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;

/** "2025-03-14" → "14.03.2025". */
export const formatDate = (isoDate: string | null) => (isoDate ? isoDate.split("-").reverse().join(".") : "");
