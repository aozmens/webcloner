"use server";

import { MEDIA_BUCKET } from "@/lib/supabase/media";
import { requireAdmin } from "../auth";
import { removeFiles } from "../media-server";
import { dbMessage, fail, refreshSite, type ActionResult } from "../result";

export type DownloadInput = {
  productId: string | null;
  title: string;
  model: string;
  version: string;
  /** yyyy-mm-dd or "" */
  releaseDate: string;
  note: string;
  published: boolean;
};

function row(input: DownloadInput) {
  return {
    product_id: input.productId || null,
    title: input.title.trim(),
    model: input.model.trim(),
    version: input.version.trim(),
    release_date: /^\d{4}-\d{2}-\d{2}$/.test(input.releaseDate) ? input.releaseDate : null,
    note: input.note.trim(),
    published: input.published,
  };
}

/**
 * Records a PDF the browser has just uploaded to Storage (large files never pass through the server). The size
 * is read from Storage, so it is always the real one.
 */
export async function createDownload(input: DownloadInput & { storagePath: string }): Promise<ActionResult> {
  if (!input.title.trim()) return fail("Başlık boş olamaz.");
  if (!/^dokumanlar\/[a-z0-9-]+\/[\w.-]+\.pdf$/.test(input.storagePath)) return fail("Geçersiz dosya yolu.");
  const { supabase } = await requireAdmin();
  const { data: info, error: infoError } = await supabase.storage.from(MEDIA_BUCKET).info(input.storagePath);
  const size = info?.size ?? 0;
  if (infoError || !size) return fail("Yüklenen dosya depoda bulunamadı. Lütfen tekrar yükleyin.");
  const { error } = await supabase.from("downloads").insert({ ...row(input), storage_path: input.storagePath, size_bytes: size });
  if (error) {
    await removeFiles(supabase, [input.storagePath]);
    return fail(dbMessage(error));
  }
  refreshSite();
  return { ok: true };
}

export async function updateDownload(id: string, input: DownloadInput): Promise<ActionResult> {
  if (!input.title.trim()) return fail("Başlık boş olamaz.");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("downloads").update(row(input)).eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}

export async function setDownloadPublished(id: string, published: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("downloads").update({ published }).eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}

export async function deleteDownload(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("downloads").delete().eq("id", id).select("storage_path").single();
  if (error || !data) return fail(dbMessage(error, "Dosya silinemedi."));
  await removeFiles(supabase, [data.storage_path]);
  refreshSite();
  return { ok: true };
}

/** Removes a file whose database record could not be created (called by the upload form after a failure). */
export async function discardUpload(storagePath: string): Promise<ActionResult> {
  if (!/^dokumanlar\//.test(storagePath)) return fail("Geçersiz dosya yolu.");
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("downloads").select("id", { count: "exact", head: true }).eq("storage_path", storagePath);
  if (!count) await removeFiles(supabase, [storagePath]);
  return { ok: true };
}
