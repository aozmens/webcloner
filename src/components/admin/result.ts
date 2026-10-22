// Result of a panel action, with database errors turned into messages the editor can act on.
import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/supabase/public";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

type DbError = { code?: string; message: string } | null;

export function dbMessage(error: DbError, fallback = "İşlem kaydedilemedi. Lütfen tekrar deneyin.") {
  if (!error) return fallback;
  console.error("Panel veritabanı hatası:", error);
  switch (error.code) {
    case "23505":
      return "Bu kısa ad (adres) zaten kullanılıyor. Farklı bir kısa ad yazın.";
    case "23503":
      return "Bu kayda bağlı başka kayıtlar var. Önce onları taşıyın ya da silin.";
    case "23514":
      return "Bazı alanlar geçersiz. Kısa ad yalnızca küçük harf, rakam ve tire içerebilir; başlık boş olamaz.";
    case "42501":
      return "Bu işlem için yetkiniz yok. Çıkış yapıp yeniden giriş yapmayı deneyin.";
    default:
      return fallback;
  }
}

export const fail = (error: string): ActionResult<never> => ({ ok: false, error });

/** After any change to published content: refresh the cached Supabase data and every site page. */
export function refreshSite() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}
