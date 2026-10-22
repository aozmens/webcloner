import type { Metadata } from "next";
import { requireAdmin } from "@/components/admin/auth";
import { DownloadsManager, type PanelDownload } from "@/components/admin/downloads-manager";
import { Notice, PageTitle } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";

export const metadata: Metadata = { title: "İndirmeler" };

export default async function Page({ searchParams }: { searchParams: Promise<{ urun?: string }> }) {
  const { urun } = await searchParams;
  const { supabase } = await requireAdmin();
  const [downloads, products] = await Promise.all([
    supabase.from("downloads").select("*").order("release_date", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
    supabase.from("products").select("id, name, slug").order("name"),
  ]);
  if (downloads.error || products.error) return <Notice tone="error">Dosyalar yüklenemedi. Sayfayı yenileyin.</Notice>;

  // Same rule as the product page: the newest published file of each product.
  const current = new Set<string>();
  const seen = new Set<string>();
  for (const download of downloads.data) {
    if (!download.product_id || !download.published || seen.has(download.product_id)) continue;
    seen.add(download.product_id);
    current.add(download.id);
  }

  const list: PanelDownload[] = downloads.data.map((download) => ({
    id: download.id,
    productId: download.product_id,
    title: download.title,
    model: download.model,
    version: download.version,
    releaseDate: download.release_date ?? "",
    note: download.note,
    published: download.published,
    src: mediaUrl(download.storage_path),
    size: download.size_bytes,
    isCurrent: current.has(download.id),
  }));

  return (
    <>
      <PageTitle title="İndirmeler" description="Kullanım kılavuzları ve diğer PDF dosyaları. Ürün sayfasında her ürünün yalnızca en güncel sürümü görünür; İndirmeler sayfasında “Sitede” işaretli tüm dosyalar listelenir." />
      <DownloadsManager downloads={list} products={products.data} focusProduct={urun && products.data.some((p) => p.id === urun) ? urun : null} />
    </>
  );
}
