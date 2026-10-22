// Service role client: bypasses row level security. Server only (form submissions, scripts).
import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServiceRoleKey, getSupabaseUrl } from "@/lib/server-env";
import type { Database } from "./database.types";

export function createServiceClient() {
  return createClient<Database>(getSupabaseUrl(), getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
