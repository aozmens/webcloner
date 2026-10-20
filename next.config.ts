import type { NextConfig } from "next";
import { productRedirects } from "./src/components/sites/teknosem/slugs";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // The old WordPress URLs end in "/". Next's built-in slash redirect (308) would run before the product
  // table and turn every old link into a 308 -> 301 chain, so slashes are handled in redirects() instead.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...productRedirects(),
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
};

export default nextConfig;
