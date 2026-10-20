import type { Metadata } from "next";
import { DownloadsPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "İndirmeler - Teknosem",
  description: "İndirme merkeziyle istediğin dosyayı anında indir.",
  ...(siteUrl ? { alternates: { canonical: "indirmeler" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <DownloadsPage />
    </SiteShell>
  );
}
