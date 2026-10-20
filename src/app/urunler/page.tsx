import type { Metadata } from "next";
import { CatalogPage } from "@/components/sites/teknosem/catalog-page";
import { catalog } from "@/components/sites/teknosem/content";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";

export const metadata: Metadata = {
  title: "Ürünlerimiz - Teknosem",
  description:
    "Robotik sistemlerimiz, akademik bilgi ve mühendislik uzmanlığıyla endüstriyel üretimden sağlığa kadar geniş bir kullanım alanı sunar.",
  ...(siteUrl ? { alternates: { canonical: "urunler" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <CatalogPage categories={catalog} />
    </SiteShell>
  );
}
