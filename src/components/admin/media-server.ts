// Image uploads from the panel: every image is converted to WebP and limited in size on the server, whatever the
// browser sent, then stored in the "media" bucket under a fresh name (so cached copies never go stale).
import "server-only";
import { randomUUID } from "node:crypto";
import sharp, { type OutputInfo } from "sharp";
import { MEDIA_BUCKET } from "@/lib/supabase/media";
import type { createSessionClient } from "@/lib/supabase/session";

type Client = Awaited<ReturnType<typeof createSessionClient>>;

/** Longest edge per use, as in scripts/teknosem/build-content.mjs. */
export const MAX_EDGE = { product: 1800, slide: 2560, logo: 480 } as const;

const ACCEPTED = /^image\/(jpeg|png|webp|gif|avif|heic|heif|tiff)$/;
const MAX_INPUT_BYTES = 4 * 1024 * 1024;

export type UploadedImage = { path: string; width: number; height: number };

export async function uploadImage(supabase: Client, file: unknown, folder: string, maxEdge: number): Promise<UploadedImage | { error: string }> {
  if (!(file instanceof File) || file.size === 0) return { error: "Görsel seçilmedi." };
  if (!ACCEPTED.test(file.type)) return { error: "Bu dosya bir görsel değil. JPG, PNG veya WebP yükleyin." };
  if (file.size > MAX_INPUT_BYTES) return { error: "Görsel çok büyük (en fazla 4 MB). Daha küçük bir dosya seçin." };

  let output: { data: Buffer; info: OutputInfo };
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 5, alphaQuality: 90 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return { error: "Görsel okunamadı. Dosya bozuk olabilir; farklı bir dosya deneyin." };
  }

  const path = `${folder}/${randomUUID()}.webp`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, output.data, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) {
    console.error("Görsel yüklenemedi:", error);
    return { error: "Görsel depoya yüklenemedi. Lütfen tekrar deneyin." };
  }
  return { path, width: output.info.width, height: output.info.height };
}

/** Deletes files from the bucket; a failure is only logged, since the database row is already gone. */
export async function removeFiles(supabase: Client, paths: string[]) {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) console.error("Depodan silinemedi:", paths, error);
}
