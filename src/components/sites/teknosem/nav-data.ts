// Slim, serialisable view of the catalog for client components (header, mega menu, mobile menu, search).
// Built on the server so the browser bundle never carries the full product content.

import { catalog, categoryHref, product, productHref, productsHref, shortName, type ImageAsset } from "./content";

export type NavProduct = { slug: string; name: string; short: string; href: string; thumb: ImageAsset; summary: string };
export type NavGroup = { slug: string; title: string; href: string; products: NavProduct[] };
export type NavCategory = { slug: string; title: string; href: string; groups: NavGroup[] };
export type NavData = { productsHref: string; categories: NavCategory[] };

export function buildNavData(): NavData {
  return {
    productsHref,
    categories: catalog.map((category) => ({
      slug: category.slug,
      title: category.title,
      href: categoryHref(category),
      groups: category.groups.map((group) => ({
        slug: group.slug,
        title: group.title,
        href: categoryHref(category, group),
        products: group.products.map((slug) => {
          const p = product(slug);
          return { slug, name: p.name, short: shortName(p), href: productHref(p), thumb: p.images[0], summary: p.shortDescription };
        }),
      })),
    })),
  };
}
