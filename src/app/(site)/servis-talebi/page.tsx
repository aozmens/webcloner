import type { Metadata } from "next";
import { ServiceRequestPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "Servis Talebi - Teknosem",
  description: "Teknik Destek Servis Talebiniz için buradayız.",
  ...(siteUrl ? { alternates: { canonical: "servis-talebi" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <ServiceRequestPage />
    </SiteShell>
  );
}
