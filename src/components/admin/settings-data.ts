// Current editable texts for the panel (defaults filled in for anything not saved yet).
import "server-only";
import { readSettings } from "@/components/sites/teknosem/settings";
import type { requireAdmin } from "./auth";

type Client = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

export async function loadSettings(supabase: Client) {
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) return null;
  return readSettings(data);
}
