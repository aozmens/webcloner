import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { leadSentence, products } from "@/components/sites/teknosem/content";
import { ProductPage } from "@/components/sites/teknosem/product-page";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

const findProduct = (slug: string) => products.find((product) => product.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = findProduct((await params).slug);
  if (!product) return {};
  const description = product.seo.description || leadSentence(product.shortDescription);
  // Canonical URL and og:image need the production domain (metadataBase), which is not decided yet.
  return {
    title: `${product.name} - Teknosem`,
    description,
    openGraph: { title: `${product.name} - Teknosem`, description, type: "website", locale: "tr_TR", siteName: "Teknosem" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const product = findProduct((await params).slug);
  if (!product) notFound();
  return (
    <SiteShell page="product">
      <ProductPage product={product} />
    </SiteShell>
  );
}
