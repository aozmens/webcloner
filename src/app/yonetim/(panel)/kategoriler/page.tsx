import type { Metadata } from "next";
import { requireAdmin } from "@/components/admin/auth";
import { CatalogEditor, type EditorCategory } from "@/components/admin/catalog-editor";
import { Notice, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Kategoriler" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const [categories, groups, products] = await Promise.all([
    supabase.from("categories").select("*").order("sort").order("title"),
    supabase.from("groups").select("*").order("sort").order("title"),
    supabase.from("products").select("group_id"),
  ]);
  if (categories.error || groups.error || products.error) return <Notice tone="error">Kategoriler yüklenemedi. Sayfayı yenileyin.</Notice>;

  const counts = new Map<string, number>();
  for (const row of products.data) counts.set(row.group_id, (counts.get(row.group_id) ?? 0) + 1);

  const tree: EditorCategory[] = categories.data.map((category) => ({
    id: category.id,
    title: category.title,
    slug: category.slug,
    published: category.published,
    groups: groups.data
      .filter((group) => group.category_id === category.id)
      .map((group) => ({ id: group.id, categoryId: group.category_id, title: group.title, slug: group.slug, published: group.published, productCount: counts.get(group.id) ?? 0 })),
  }));

  return (
    <>
      <PageTitle
        title="Kategoriler"
        description="Menüde, Ürünler sayfasında ve alt bilgide görünen kategori ve gruplar. Sırayı oklarla ya da sürükleyerek değiştirin. Gizli bir kategori veya gruptaki ürünler sitede görünmez."
      />
      <CatalogEditor categories={tree} />
    </>
  );
}
