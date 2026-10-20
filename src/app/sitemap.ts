import type { MetadataRoute } from "next";
import { catalog, pages, products } from "@/components/sites/teknosem/content";
import { basePath, siteUrl } from "@/components/sites/teknosem/site-config";

/** Every public route. Empty until NEXT_PUBLIC_TEKNOSEM_SITE_URL is set, because sitemaps need absolute URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const url = (path: string) => `${siteUrl}${basePath}${path}`;
  return [
    { url: url("/"), priority: 1 },
    { url: url("/urunler"), priority: 0.9 },
    ...catalog.map((category) => ({ url: url(`/urunler/${category.slug}`), priority: 0.8 })),
    ...products.map((product) => ({ url: url(`/urun/${product.slug}`), priority: 0.8 })),
    ...Object.values(pages).map((page) => ({ url: url(page.path), priority: page.path === "/kvkk" ? 0.3 : 0.6 })),
  ];
}
