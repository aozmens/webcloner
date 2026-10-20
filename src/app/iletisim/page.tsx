import type { Metadata } from "next";
import { ContactPage } from "@/components/sites/teknosem/corporate-pages";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import "@/components/sites/teknosem/product.css";
import "@/components/sites/teknosem/corporate.css";

export const metadata: Metadata = {
  title: "İletişim - Teknosem",
  description: "Bilgi almak için veya teknik sorunlar ve kurulum talepleriniz için iletişim formunu doldurarak ya da iletişim bilgilerimizi kullanarak bizimle iletişime geçebilirsiniz.",
  ...(siteUrl ? { alternates: { canonical: "iletisim" } } : {}),
};

export default function Page() {
  return (
    <SiteShell page="listing">
      <ContactPage />
    </SiteShell>
  );
}
