"use server";

import { revalidatePath } from "next/cache";
import type { SubmissionStatus } from "@/lib/supabase/database.types";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";
import { requireAdmin } from "../auth";
import { dbMessage, fail, type ActionResult } from "../result";

const statuses: SubmissionStatus[] = ["new", "seen", "done"];

// Submissions are not shown on the site, so only the panel (badge counter and list) is refreshed.
const refreshPanel = () => revalidatePath(ADMIN_PATH, "layout");

export async function updateSubmission(id: string, fields: { status?: SubmissionStatus; note?: string }): Promise<ActionResult> {
  if (fields.status && !statuses.includes(fields.status)) return fail("Geçersiz durum.");
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("submissions")
    .update({ ...(fields.status ? { status: fields.status } : {}), ...(fields.note !== undefined ? { note: fields.note.slice(0, 5000) } : {}) })
    .eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshPanel();
  return { ok: true };
}

export async function deleteSubmission(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("submissions").delete().eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshPanel();
  return { ok: true };
}
