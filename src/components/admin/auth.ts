// Panel access. Signed in is not enough: the account must also be listed in admin_users. Every panel page and
// every server action calls requireAdmin(); row level security enforces the same rule in the database.
import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createSessionClient } from "@/lib/supabase/session";
import { ADMIN_LOGIN_PATH } from "@/components/sites/teknosem/site-config";

export const requireAdmin = cache(async () => {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect(`${ADMIN_LOGIN_PATH}?hata=yetki`);
  return { supabase, user };
});
