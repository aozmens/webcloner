import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/sites/teknosem/catalog-page";
import { getSiteData } from "@/components/sites/teknosem/site-data";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";

export async function generateStaticParams() {
  return (await getSiteData()).catalog.map((category) => ({ kategori: category.slug }));
}

const findCategory = async (slug: string) => (await getSiteData()).catalog.find((category) => category.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }): Promise<Metadata> {
  const category = await findCategory((await params).kategori);
  if (!category) return {};
  return {
    title: `${category.title} - Teknosem`,
    description: `${category.title}: ${category.groups.map((group) => group.title).join(", ")}.`,
    ...(siteUrl ? { alternates: { canonical: `urunler/${category.slug}` } } : {}),
  };
}

export default async function Page({ params }: { params: Promise<{ kategori: string }> }) {
  const category = await findCategory((await params).kategori);
  if (!category) notFound();
  const { catalog } = await getSiteData();
  return (
    <SiteShell page="listing">
      <CatalogPage categories={catalog} current={category} />
    </SiteShell>
  );
}
