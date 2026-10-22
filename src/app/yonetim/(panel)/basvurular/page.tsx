import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/components/admin/auth";
import { statusLabels } from "@/components/admin/labels";
import { SubmissionsList } from "@/components/admin/submissions-list";
import { Notice, PageTitle } from "@/components/admin/ui";
import type { SubmissionStatus } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";

export const metadata: Metadata = { title: "Başvurular" };

const LIMIT = 200;
const filters: { value: SubmissionStatus | "all"; label: string }[] = [
  { value: "new", label: statusLabels.new },
  { value: "seen", label: statusLabels.seen },
  { value: "done", label: statusLabels.done },
  { value: "all", label: "Tümü" },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const { durum } = await searchParams;
  const status = filters.some((f) => f.value === durum) ? (durum as SubmissionStatus | "all") : "new";
  const { supabase } = await requireAdmin();

  let query = supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(LIMIT);
  if (status !== "all") query = query.eq("status", status);
  const [submissions, products] = await Promise.all([query, supabase.from("products").select("slug, name")]);
  if (submissions.error) return <Notice tone="error">Başvurular yüklenemedi. Sayfayı yenileyin.</Notice>;

  const productNames = new Map((products.data ?? []).map((p) => [p.slug, p]));

  return (
    <>
      <PageTitle
        title="Başvurular"
        description="Teklif Al, Servis Talebi ve İletişim formlarından gelenler. Ziyaretçi formu gönderdikten sonra WhatsApp'a yönlendirilir; mesajı göndermeyi unutmuş olabilir, bu yüzden buradaki kayıt esastır."
      />
      <div className="mb-4 flex flex-wrap gap-1" role="tablist">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            role="tab"
            aria-selected={filter.value === status}
            href={`${ADMIN_PATH}/basvurular?durum=${filter.value}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              filter.value === status ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      <SubmissionsList
        items={submissions.data.map((row) => ({
          id: row.id,
          kind: row.kind,
          name: row.name,
          company: row.company,
          phone: row.phone,
          email: row.email,
          subject: row.subject,
          product: productNames.get(row.product_slug) ?? null,
          productSlug: row.product_slug,
          message: row.message,
          status: row.status,
          note: row.note,
          createdAt: row.created_at,
        }))}
      />
      {submissions.data.length === LIMIT && <p className="mt-4 text-xs text-neutral-500">En yeni {LIMIT} başvuru gösteriliyor.</p>}
    </>
  );
}
