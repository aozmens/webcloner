// Browser client for the panel. Used only for direct uploads to Storage (large PDFs never pass through the
// server); row level security allows them for admins only.
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/public-env";
import type { Database } from "./database.types";

export const createBrowserSupabase = () => createBrowserClient<Database>(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey);
