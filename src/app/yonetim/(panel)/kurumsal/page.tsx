import type { Metadata } from "next";
import { requireAdmin } from "@/components/admin/auth";
import { CorporateEditor } from "@/components/admin/corporate-editor";
import { loadSettings } from "@/components/admin/settings-data";
import { Notice, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Kurumsal" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const settings = await loadSettings(supabase);
  if (!settings) return <Notice tone="error">Kurumsal metinler yüklenemedi. Sayfayı yenileyin.</Notice>;
  return (
    <>
      <PageTitle title="Kurumsal" description="İletişim bilgileri, Hakkımızda, Hizmetler ve KVKK metni. Her bölümün kendi “Kaydet” düğmesi vardır." />
      <CorporateEditor settings={settings} />
    </>
  );
}
