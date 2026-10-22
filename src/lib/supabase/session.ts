// Client acting as the signed-in panel user (auth cookies). Writes go through row level security, so only
// accounts listed in admin_users can change anything.
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/public-env";
import type { Database } from "./database.types";

export async function createSessionClient() {
  const store = await cookies();
  return createServerClient<Database>(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Server components cannot set cookies; the proxy refreshes the session on the next request.
        }
      },
    },
  });
}
