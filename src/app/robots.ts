import type { MetadataRoute } from "next";
import { ADMIN_PATH, allowIndexing, siteUrl } from "@/components/sites/teknosem/site-config";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    // Test deployment: keep the whole site out of search engines.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: [ADMIN_PATH, `${ADMIN_PATH}/`, "/api/"] },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl } : {}),
  };
}
