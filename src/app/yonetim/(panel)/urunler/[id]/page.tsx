import { ExternalLink, FileDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/components/admin/auth";
import { loadGroupOptions, toProductInput } from "@/components/admin/product-data";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImages } from "@/components/admin/product-images";
import { Badge, buttonClass, Card, Notice, PageTitle } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";
import { formatDate } from "@/components/sites/teknosem/links";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";

export const metadata: Metadata = { title: "Ürünü düzenle" };

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ yeni?: string }> }) {
  const { id } = await params;
  const { yeni } = await searchParams;
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [{ data: product }, { data: images }, { data: downloads }, groups] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_images").select("*").eq("product_id", id).order("sort").order("created_at"),
    supabase.from("downloads").select("*").eq("product_id", id).order("release_date", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
    loadGroupOptions(supabase),
  ]);
  if (!product) notFound();

  return (
    <>
      <PageTitle
        title={product.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {product.published ? <Badge tone="green">Yayında</Badge> : <Badge tone="amber">Yayında değil</Badge>}
            <span>/urun/{product.slug}</span>
          </span>
        }
        actions={
          <>
            <Link href={`${ADMIN_PATH}/urunler`} className={buttonClass.secondary}>
              Tüm ürünler
            </Link>
            {product.published && (
              <a href={`/urun/${product.slug}`} target="_blank" rel="noopener" className={buttonClass.secondary}>
                <ExternalLink aria-hidden /> Sayfayı aç
              </a>
            )}
          </>
        }
      />
      {yeni && (
        <div className="mb-6">
          <Notice tone="ok">Ürün oluşturuldu. Şimdi görsellerini ekleyebilirsiniz; hazır olunca “Yayında” işaretleyip kaydedin.</Notice>
        </div>
      )}
      <div className="space-y-6">
        <Card title="Görseller">
          <ProductImages
            productId={product.id}
            images={(images ?? []).map((image) => ({ id: image.id, src: mediaUrl(image.storage_path), width: image.width, height: image.height, alt: image.alt }))}
          />
        </Card>
        <Card title="Kullanım kılavuzları" description="Ürün sayfasında yalnızca yayındaki en güncel sürüm gösterilir.">
          {downloads && downloads.length > 0 ? (
            <ul className="mb-3 divide-y divide-neutral-100 text-sm">
              {downloads.map((download, index) => (
                <li key={download.id} className="flex flex-wrap items-center gap-2 py-2">
                  <FileDown className="size-4 text-neutral-500" aria-hidden />
                  <span className="font-medium">{download.title}</span>
                  <span className="text-neutral-500">
                    {[download.version, formatDate(download.release_date)].filter(Boolean).join(" · ")}
                  </span>
                  {!download.published ? <Badge tone="amber">Gizli</Badge> : index === downloads.findIndex((d) => d.published) && <Badge tone="green">Ürün sayfasında</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-3 text-sm text-neutral-600">Bu ürüne bağlı kılavuz yok.</p>
          )}
          <Link href={`${ADMIN_PATH}/indirmeler?urun=${product.id}`} className={buttonClass.secondary}>
            Kılavuzları yönet
          </Link>
        </Card>
        <ProductForm initial={toProductInput(product)} groups={groups} />
      </div>
    </>
  );
}
