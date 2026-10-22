"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";
import { ADMIN_LOGIN_PATH, ADMIN_PATH } from "@/components/sites/teknosem/site-config";

export async function signIn(_state: { error: string } | null, form: FormData): Promise<{ error: string } | null> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "E-posta ve şifrenizi yazın." };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    if (error?.code === "email_not_confirmed") return { error: "E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzdaki bağlantıya tıklayın." };
    if (error?.status === 429) return { error: "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar deneyin." };
    return { error: "E-posta veya şifre hatalı." };
  }

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Bu hesabın yönetim paneline erişim yetkisi yok." };
  }
  redirect(ADMIN_PATH);
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}
