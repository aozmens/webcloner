import type { Metadata } from "next";
import { requireAdmin } from "@/components/admin/auth";
import { LogosManager } from "@/components/admin/logos-manager";
import { Notice, PageTitle } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/supabase/media";

export const metadata: Metadata = { title: "Referanslar" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("reference_logos").select("*").order("sort").order("created_at");
  if (error) return <Notice tone="error">Logolar yüklenemedi. Sayfayı yenileyin.</Notice>;
  return (
    <>
      <PageTitle
        title="Referans logoları"
        description="Sitede yayındaki ilk 12 logo ana sayfadaki kayan şeritte, tamamı Referanslar sayfasında görünür. Logolar siyah zemin üzerinde gösterildiği için şeffaf arka planlı ve açık renkli (PNG veya WebP) dosyalar en iyi sonucu verir."
      />
      <LogosManager logos={data.map((logo) => ({ id: logo.id, src: mediaUrl(logo.storage_path), name: logo.name, published: logo.published }))} />
    </>
  );
}
