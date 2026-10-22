// Deployment settings, read at build time. The site is always served at the root of its (sub)domain.
// Kept dependency-free: next.config.ts imports it too.

const trimSlash = (value: string) => value.replace(/\/+$/, "");

/** Public origin, e.g. "https://robotik.aoz-tech.com". Canonical URLs, share images and sitemap.xml need an
 *  absolute URL, so they are only emitted when it is set. */
export const siteUrl = trimSlash((process.env.NEXT_PUBLIC_TEKNOSEM_SITE_URL ?? "").trim()) || null;

/**
 * Search engine indexing. Off unless NEXT_PUBLIC_TEKNOSEM_ALLOW_INDEXING=true, so test deployments
 * (e.g. robotik.aoz-tech.com) do not compete with the production domain. When off, robots.txt disallows
 * everything and every page carries noindex.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_TEKNOSEM_ALLOW_INDEXING === "true";

/** Path prefix of the old WordPress site on teknosem.com.tr, used to map its URLs to the new ones. */
export const LEGACY_BASE = "/robotik";

/** Admin panel; never indexed. */
export const ADMIN_PATH = "/yonetim";
export const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/giris`;
