import type { MetadataRoute } from "next";
import { basePath, siteUrl } from "@/components/sites/teknosem/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // The sitemap needs absolute URLs, so it is only announced once the production domain is configured.
    ...(siteUrl ? { sitemap: `${siteUrl}${basePath}/sitemap.xml` } : {}),
  };
}
