import type { Metadata } from "next";
import { NotFoundPage } from "@/components/sites/teknosem/not-found-page";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/teknosem-adaptation.css";
import "@/components/sites/teknosem/product.css";

export const metadata: Metadata = { title: "Sayfa bulunamadı - Teknosem", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteShell page="listing">
      <NotFoundPage />
    </SiteShell>
  );
}
