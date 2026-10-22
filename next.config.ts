import type { NextConfig } from "next";
import { catalog, legacyCategoryPaths } from "./src/components/sites/teknosem/catalog";
import { pages } from "./src/components/sites/teknosem/company";
import { ADMIN_PATH, allowIndexing, LEGACY_BASE } from "./src/components/sites/teknosem/site-config";
import { legacyRedirects } from "./src/components/sites/teknosem/slugs";

const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };

/** Product images, manuals and reference logos are served from Supabase Storage. */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Inlined at build time and sent with every Supabase read (lib/supabase/public.ts). The fetch cache key includes
  // headers, so each build starts from fresh data instead of reusing responses cached by an earlier deployment.
  env: { TEKNOSEM_BUILD_ID: Date.now().toString(36) },
  // A stray package-lock.json in a parent folder would otherwise be taken as the workspace root.
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  // The old WordPress URLs end in "/". Next's built-in slash redirect (308) would run before the legacy
  // table and turn every old link into a 308 -> 301 chain, so slashes are handled in redirects() instead.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/**`)] : [],
  },
  experimental: {
    // Panel image uploads are resized in the browser first; this only leaves headroom for large originals.
    serverActions: { bodySizeLimit: "4mb" },
  },
  async redirects() {
    return [
      // Old teknosem.com.tr/robotik/... links, once the main site forwards them here with the path kept.
      ...legacyRedirects({ legacyBase: LEGACY_BASE, catalog, legacyCategoryPaths, pages: Object.values(pages) }),
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
  async headers() {
    return [
      // The admin panel is never indexed, whatever the indexing setting of the public site.
      { source: ADMIN_PATH, headers: [noindex] },
      { source: `${ADMIN_PATH}/:path*`, headers: [noindex] },
      { source: "/api/:path*", headers: [noindex] },
      // Test deployments: the header also covers PDFs and images, which carry no meta tags.
      ...(allowIndexing ? [] : [{ source: "/:path*", headers: [noindex] }]),
    ];
  },
};

export default nextConfig;
