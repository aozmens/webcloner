import type { Metadata } from "next";
import { KvkkPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "Kişisel Verilerin Korunması Kanunu (KVKK) - Teknosem",
  description: "Kişisel verilerin korunması kanunu hakkında bilgilendirme.",
  ...(siteUrl ? { alternates: { canonical: "kvkk" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <KvkkPage />
    </SiteShell>
  );
}
