// Server-side secrets. The "server-only" import makes the build fail if a client component ever imports this
// file, so the service role key can never be bundled for the browser.
import "server-only";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Eksik ortam değişkeni: ${name}. .env.example dosyasına bakın.`);
  return value;
}

/** Supabase service role key: bypasses RLS. Use only in server actions, route handlers and scripts. */
export const getServiceRoleKey = () => required("SUPABASE_SERVICE_ROLE_KEY");
export const getSupabaseUrl = () => required("NEXT_PUBLIC_SUPABASE_URL");
