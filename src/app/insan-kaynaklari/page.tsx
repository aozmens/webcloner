import type { Metadata } from "next";
import { CareersPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "İnsan Kaynakları - Teknosem",
  description: "Teknosem’de Kariyerinize Yeni Bir Başlangıç Yapın!",
  ...(siteUrl ? { alternates: { canonical: "insan-kaynaklari" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <CareersPage />
    </SiteShell>
  );
}
