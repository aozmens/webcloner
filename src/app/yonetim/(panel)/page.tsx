import Link from "next/link";
import { requireAdmin } from "@/components/admin/auth";
import { Card, PageTitle } from "@/components/admin/ui";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";

export default async function Page() {
  const { supabase } = await requireAdmin();
  const count = async (query: PromiseLike<{ count: number | null }>) => (await query).count ?? 0;
  const head = { count: "exact" as const, head: true };
  const [products, published, downloads, logos, newSubmissions] = await Promise.all([
    count(supabase.from("products").select("id", head)),
    count(supabase.from("products").select("id", head).eq("published", true)),
    count(supabase.from("downloads").select("id", head)),
    count(supabase.from("reference_logos").select("id", head)),
    count(supabase.from("submissions").select("id", head).eq("status", "new")),
  ]);

  const tiles = [
    { label: "Ürün", value: products, note: `${published} yayında`, href: `${ADMIN_PATH}/urunler` },
    { label: "İndirme dosyası", value: downloads, note: "kullanım kılavuzları", href: `${ADMIN_PATH}/indirmeler` },
    { label: "Referans logosu", value: logos, note: "ana sayfa ve Referanslar", href: `${ADMIN_PATH}/referanslar` },
    { label: "Yeni başvuru", value: newSubmissions, note: "Teklif, servis, iletişim", href: `${ADMIN_PATH}/basvurular` },
  ];

  return (
    <>
      <PageTitle title="Özet" description="Panelde yaptığınız her kayıt sitede hemen görünür." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm hover:border-blue-300">
            <p className="text-sm text-neutral-600">{tile.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{tile.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{tile.note}</p>
          </Link>
        ))}
      </div>
      <Card title="Kısa yollar" className="mt-6">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li>
            <Link className="text-blue-700 hover:underline" href={`${ADMIN_PATH}/urunler/yeni`}>
              Yeni ürün ekle
            </Link>
          </li>
          <li>
            <Link className="text-blue-700 hover:underline" href={`${ADMIN_PATH}/indirmeler`}>
              Kullanım kılavuzu yükle
            </Link>
          </li>
          <li>
            <Link className="text-blue-700 hover:underline" href={`${ADMIN_PATH}/anasayfa`}>
              Ana sayfa slaytlarını düzenle
            </Link>
          </li>
          <li>
            <Link className="text-blue-700 hover:underline" href={`${ADMIN_PATH}/kurumsal`}>
              İletişim bilgilerini güncelle
            </Link>
          </li>
        </ul>
      </Card>
    </>
  );
}
