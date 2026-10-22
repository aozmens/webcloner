import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/components/admin/auth";
import { ProductList, type ListCategory } from "@/components/admin/product-list";
import { buttonClass, Notice, PageTitle } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";

export const metadata: Metadata = { title: "Ürünler" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const [categories, groups, products, images] = await Promise.all([
    supabase.from("categories").select("id, title, published").order("sort").order("title"),
    supabase.from("groups").select("id, title, category_id, published").order("sort").order("title"),
    supabase.from("products").select("id, slug, name, group_id, published, updated_at").order("sort").order("name"),
    supabase.from("product_images").select("product_id, storage_path, sort").order("sort"),
  ]);
  if (categories.error || groups.error || products.error || images.error) return <Notice tone="error">Ürünler yüklenemedi. Sayfayı yenileyin.</Notice>;

  const thumbs = new Map<string, string>();
  for (const image of images.data) if (!thumbs.has(image.product_id)) thumbs.set(image.product_id, mediaUrl(image.storage_path));

  const tree: ListCategory[] = categories.data.map((category) => ({
    id: category.id,
    title: category.title,
    published: category.published,
    groups: groups.data
      .filter((group) => group.category_id === category.id)
      .map((group) => ({
        id: group.id,
        title: group.title,
        published: group.published,
        products: products.data
          .filter((product) => product.group_id === group.id)
          .map((product) => ({ id: product.id, slug: product.slug, name: product.name, published: product.published, thumb: thumbs.get(product.id) ?? null })),
      })),
  }));

  return (
    <>
      <PageTitle
        title="Ürünler"
        description="Sıralama her grubun içinde geçerlidir ve menüde, Ürünler sayfasında aynı sırayla görünür. Yayında olmayan ürünler sitede görünmez."
        actions={
          <Link href={`${ADMIN_PATH}/urunler/yeni`} className={buttonClass.primary}>
            <Plus aria-hidden /> Yeni ürün
          </Link>
        }
      />
      <ProductList categories={tree} />
    </>
  );
}
