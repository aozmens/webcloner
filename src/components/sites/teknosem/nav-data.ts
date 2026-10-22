// Slim, serialisable view of the catalog for client components (header, mega menu, mobile menu, search).
// Built on the server so the browser bundle never carries the full product content.

import { categoryHref, productHref, productsHref } from "./links";
import type { ImageAsset } from "./media";
import type { SiteData } from "./site-data";

export type NavProduct = { slug: string; name: string; short: string; href: string; thumb?: ImageAsset; summary: string };
export type NavGroup = { slug: string; title: string; href: string; products: NavProduct[] };
export type NavCategory = { slug: string; title: string; href: string; groups: NavGroup[] };
export type NavData = { productsHref: string; whatsappHref: string; categories: NavCategory[] };

export function buildNavData({ catalog, contact }: SiteData): NavData {
  return {
    productsHref,
    whatsappHref: contact.whatsappHref,
    categories: catalog.map((category) => ({
      slug: category.slug,
      title: category.title,
      href: categoryHref(category),
      groups: category.groups.map((group) => ({
        slug: group.slug,
        title: group.title,
        href: categoryHref(category, group),
        products: group.products.map((p) => ({
          slug: p.slug,
          name: p.name,
          short: p.shortName,
          href: productHref(p),
          thumb: p.images[0],
          summary: p.shortDescription,
        })),
      })),
    })),
  };
}
