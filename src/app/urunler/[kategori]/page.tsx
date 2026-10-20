import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/sites/teknosem/catalog-page";
import { catalog, categoryBySlug } from "@/components/sites/teknosem/content";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.map((category) => ({ kategori: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }): Promise<Metadata> {
  const category = categoryBySlug((await params).kategori);
  if (!category) return {};
  return {
    title: `${category.title} - Teknosem`,
    description: `${category.title}: ${category.groups.map((group) => group.title).join(", ")}.`,
    ...(siteUrl ? { alternates: { canonical: `urunler/${category.slug}` } } : {}),
  };
}

export default async function Page({ params }: { params: Promise<{ kategori: string }> }) {
  const category = categoryBySlug((await params).kategori);
  if (!category) notFound();
  return (
    <SiteShell page="listing">
      <CatalogPage categories={catalog} current={category} />
    </SiteShell>
  );
}
