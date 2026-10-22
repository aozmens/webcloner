import { ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/components/admin/actions/auth";
import { requireAdmin } from "@/components/admin/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { supabase, user } = await requireAdmin();
  const { count: newSubmissions } = await supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "new");

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-blue-700">TEKNOSEM</p>
            <p className="truncate text-sm font-semibold">Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
              <ExternalLink className="size-4" aria-hidden />
              <span className="hidden sm:inline">Siteyi aç</span>
            </a>
            <form action={signOut}>
              <button type="submit" title={user.email ?? undefined} className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </form>
          </div>
        </div>
        <AdminNav newSubmissions={newSubmissions ?? 0} />
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
