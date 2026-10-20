import type { Metadata } from "next";
import { ServicesPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "Hizmetler - Teknosem",
  description: "Teknosem olarak, robotik otomasyon sistemleri alanında yenilikçi ve güvenilir çözümler sunuyoruz.",
  ...(siteUrl ? { alternates: { canonical: "hizmetler" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <ServicesPage />
    </SiteShell>
  );
}
