import type { NextConfig } from "next";
import { catalog, legacyCategoryPaths } from "./src/components/sites/teknosem/catalog";
import { pages } from "./src/components/sites/teknosem/company";
import { basePath, LEGACY_BASE } from "./src/components/sites/teknosem/site-config";
import { legacyRedirects } from "./src/components/sites/teknosem/slugs";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Set NEXT_PUBLIC_TEKNOSEM_BASE_PATH=/robotik to serve the site under teknosem.com.tr/robotik.
  ...(basePath ? { basePath } : {}),
  // The old WordPress URLs end in "/". Next's built-in slash redirect (308) would run before the legacy
  // table and turn every old link into a 308 -> 301 chain, so slashes are handled in redirects() instead.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...legacyRedirects({ basePath, legacyBase: LEGACY_BASE, catalog, legacyCategoryPaths, pages: Object.values(pages) }),
      // 301 like the legacy table: under basePath "/robotik" some old URLs differ from the new ones only by the slash.
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
};

export default nextConfig;
