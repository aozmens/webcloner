import type { Metadata } from "next";
import { requireAdmin } from "@/components/admin/auth";
import { HomeEditor, type ProductChoice } from "@/components/admin/home-editor";
import { loadSettings } from "@/components/admin/settings-data";
import { Notice, PageTitle } from "@/components/admin/ui";
import { leadSentence } from "@/components/sites/teknosem/links";
import { mediaUrl } from "@/lib/supabase/media";

export const metadata: Metadata = { title: "Ana Sayfa" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const [settings, products, images] = await Promise.all([
    loadSettings(supabase),
    supabase.from("products").select("id, slug, name, short_description").eq("published", true).order("name"),
    supabase.from("product_images").select("product_id, storage_path").order("sort").order("created_at"),
  ]);
  if (!settings || products.error || images.error) return <Notice tone="error">Ana sayfa içeriği yüklenemedi. Sayfayı yenileyin.</Notice>;

  const choices: ProductChoice[] = products.data.map((product) => ({
    slug: product.slug,
    name: product.name,
    lead: leadSentence(product.short_description),
    images: images.data.filter((image) => image.product_id === product.id).map((image) => mediaUrl(image.storage_path)),
  }));

  return (
    <>
      <PageTitle title="Ana Sayfa" description="Her bölümün kendi “Kaydet” düğmesi vardır. Referans logoları için Referanslar sekmesini kullanın." />
      <HomeEditor settings={settings} products={choices} />
    </>
  );
}
