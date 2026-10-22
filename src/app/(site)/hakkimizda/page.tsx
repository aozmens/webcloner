import type { Metadata } from "next";
import { AboutPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "Hakkımızda - Teknosem",
  description: "Teknosem Test ve Analiz Cihazları Teknoloji Araştırma Sanayi Dış Ticaret A.Ş., 1994 yılında şahıs şirketi olarak kurulmuş ve üretime başlamıştır.",
  ...(siteUrl ? { alternates: { canonical: "hakkimizda" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <AboutPage />
    </SiteShell>
  );
}
