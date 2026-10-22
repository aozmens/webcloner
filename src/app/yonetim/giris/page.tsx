import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Giriş" };

export default async function Page({ searchParams }: { searchParams: Promise<{ hata?: string }> }) {
  const { hata } = await searchParams;
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-blue-700">TEKNOSEM</p>
        <h1 className="mt-1 text-2xl font-semibold">Yönetim Paneli</h1>
        <p className="mt-1 text-sm text-neutral-600">E-posta adresiniz ve şifrenizle giriş yapın.</p>
        <LoginForm initialError={hata === "yetki" ? "Bu hesabın yönetim paneline erişim yetkisi yok." : undefined} />
      </div>
    </main>
  );
}
