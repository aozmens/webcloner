import type { MetadataRoute } from "next";
import { pages } from "@/components/sites/teknosem/links";
import { allowIndexing, siteUrl } from "@/components/sites/teknosem/site-config";
import { getSiteData } from "@/components/sites/teknosem/site-data";

/** Every public route. Empty until NEXT_PUBLIC_TEKNOSEM_SITE_URL is set, because sitemaps need absolute URLs. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteUrl || !allowIndexing) return [];
  const { catalog, products } = await getSiteData();
  const url = (path: string) => `${siteUrl}${path}`;
  return [
    { url: url("/"), priority: 1 },
    { url: url("/urunler"), priority: 0.9 },
    ...catalog.map((category) => ({ url: url(`/urunler/${category.slug}`), priority: 0.8 })),
    ...products.map((product) => ({ url: url(`/urun/${product.slug}`), priority: 0.8 })),
    ...Object.values(pages).map((page) => ({ url: url(page.path), priority: page.path === "/kvkk" ? 0.3 : 0.6 })),
  ];
}
