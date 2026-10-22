// Anonymous client for the public site. Row level security limits it to published rows. Every request is cached
// by Next.js under CONTENT_TAG, so pages stay static until the panel saves something and calls updateTag().
import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/public-env";
import type { Database } from "./database.types";

export const CONTENT_TAG = "teknosem-content";

export function createPublicClient() {
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    throw new Error("Eksik ortam değişkeni: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. .env.example dosyasına bakın.");
  }
  return createClient<Database>(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      headers: { "x-teknosem-build": process.env.TEKNOSEM_BUILD_ID ?? "" },
      fetch: (input, init) => fetch(input, { ...init, cache: "force-cache", next: { tags: [CONTENT_TAG] } }),
    },
  });
}
