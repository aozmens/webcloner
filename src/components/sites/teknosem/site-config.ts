// Deployment settings, read at build time so the same code serves any hosting shape:
//   kök (teknosem.com.tr/)              → no variables
//   alt alan adı (robotik.teknosem.com.tr) → NEXT_PUBLIC_TEKNOSEM_SITE_URL only
//   /robotik altında (teknosem.com.tr/robotik) → also NEXT_PUBLIC_TEKNOSEM_BASE_PATH=/robotik
// Kept dependency-free: next.config.ts imports it too.

const trimSlash = (value: string) => value.replace(/\/+$/, "");

/** Path the site is served under, e.g. "/robotik"; empty when served at the domain root. */
export const basePath = (() => {
  const raw = trimSlash((process.env.NEXT_PUBLIC_TEKNOSEM_BASE_PATH ?? "").trim());
  return raw && !raw.startsWith("/") ? `/${raw}` : raw;
})();

/** Public origin, e.g. "https://teknosem.com.tr". Unset until the domain is decided: canonical URLs and
 *  share images (which need an absolute URL) are only emitted once it is set. */
export const siteUrl = trimSlash((process.env.NEXT_PUBLIC_TEKNOSEM_SITE_URL ?? "").trim()) || null;

/** Prefix for plain <a href> links and next/image sources; next/link adds basePath by itself. */
export const withBase = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

/** Path prefix of the old WordPress site on teknosem.com.tr, used to map its URLs to the new ones. */
export const LEGACY_BASE = "/robotik";
