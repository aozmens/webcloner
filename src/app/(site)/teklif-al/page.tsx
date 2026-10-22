import type { Metadata } from "next";
import { QuotePage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "Teklif Al - Teknosem",
  description: "Size özel fiyat teklifi almak için formu doldurun. Profesyonel ekibimiz en kısa sürede sizinle iletişime geçecektir.",
  ...(siteUrl ? { alternates: { canonical: "teklif-al" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <QuotePage />
    </SiteShell>
  );
}
