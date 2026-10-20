import type { Metadata } from "next";
import { ReferencesPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "Referanslar - Teknosem",
  description: "Teknosem referansları.",
  ...(siteUrl ? { alternates: { canonical: "referanslar" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <ReferencesPage />
    </SiteShell>
  );
}
