import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { leadSentence } from "@/components/sites/teknosem/links";
import { ProductPage } from "@/components/sites/teknosem/product-page";
import { getSiteData } from "@/components/sites/teknosem/site-data";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import "@/components/sites/teknosem/product.css";

// Products added in the panel after the build are rendered on their first visit, then cached.
export async function generateStaticParams() {
  return (await getSiteData()).products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = (await getSiteData()).product((await params).slug);
  if (!product) return {};
  const title = product.seo.title || `${product.name} - Teknosem`;
  const description = product.seo.description || leadSentence(product.shortDescription);
  const image = product.images[0];
  return {
    title,
    description,
    // Canonical and og:image need an absolute URL: only set when NEXT_PUBLIC_TEKNOSEM_SITE_URL is configured.
    ...(siteUrl ? { alternates: { canonical: `urun/${product.slug}` } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      siteName: "Teknosem",
      ...(siteUrl && image ? { images: [{ url: image.src.startsWith("/") ? `${siteUrl}${image.src}` : image.src, width: image.width, height: image.height, alt: product.name }] } : {}),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const product = (await getSiteData()).product((await params).slug);
  if (!product) notFound();
  const group = (await getSiteData()).catalog.flatMap((category) => category.groups).find((g) => g.slug === product.group.slug);
  return (
    <SiteShell page="product">
      <ProductPage product={product} siblings={(group?.products ?? []).filter((p) => p.slug !== product.slug)} />
    </SiteShell>
  );
}
