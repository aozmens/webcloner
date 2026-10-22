import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/components/admin/auth";
import { emptyProduct, loadGroupOptions } from "@/components/admin/product-data";
import { ProductForm } from "@/components/admin/product-form";
import { Notice, PageTitle } from "@/components/admin/ui";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";

export const metadata: Metadata = { title: "Yeni ürün" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const groups = await loadGroupOptions(supabase);
  return (
    <>
      <PageTitle title="Yeni ürün" description="Önce temel bilgileri kaydedin; görselleri kayıttan sonra açılan sayfada ekleyebilirsiniz. Yeni ürün, “Yayında” işaretlenene kadar sitede görünmez." />
      {groups.length === 0 ? (
        <Notice tone="info">
          Ürün eklemeden önce en az bir grup gerekir. <Link className="underline" href={`${ADMIN_PATH}/kategoriler`}>Kategoriler</Link> sayfasından ekleyin.
        </Notice>
      ) : (
        <ProductForm initial={emptyProduct()} groups={groups} />
      )}
    </>
  );
}
