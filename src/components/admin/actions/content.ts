"use server";

import type { Json } from "@/lib/supabase/database.types";
import { mediaUrl } from "@/lib/supabase/media";
import { isSafeHref, readSetting, settingKeys, type SettingKey, type Settings } from "@/components/sites/teknosem/settings";
import { requireAdmin } from "../auth";
import { MAX_EDGE, removeFiles, uploadImage } from "../media-server";
import { dbMessage, fail, refreshSite, type ActionResult } from "../result";

/** Saves one section of the editable texts. The value is coerced to the expected shape before it is stored. */
export async function saveSetting<K extends SettingKey>(key: K, value: Settings[K]): Promise<ActionResult> {
  if (!settingKeys.includes(key)) return fail("Geçersiz bölüm.");
  const clean = readSetting(key, value);
  if (key === "contact") {
    const contact = clean as Settings["contact"];
    if (!contact.phone.trim() || !contact.email.trim()) return fail("Telefon ve e-posta boş olamaz.");
    if (contact.whatsapp.replace(/\D/g, "").length < 10) return fail("WhatsApp numarasını ülke koduyla yazın (ör. +90 545 829 06 52).");
  }
  if (key === "hero") {
    const slides = (clean as Settings["hero"]).slides;
    for (const [index, slide] of slides.entries()) {
      const name = `Slayt ${index + 1}`;
      if (!slide.productSlug && !slide.image.src) return fail(`${name}: ürün seçilmediği için bir görsel yükleyin.`);
      if (!slide.productSlug && !slide.title.trim()) return fail(`${name}: ürün seçilmediği için bir başlık yazın.`);
      if (slide.buttonHref.trim() && !isSafeHref(slide.buttonHref.trim())) {
        return fail(`${name}: düğme bağlantısı "/" ile (ör. /iletisim) ya da https:// ile başlamalı.`);
      }
    }
  }
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("site_settings").upsert({ key, value: clean as unknown as Json });
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}

/** Uploads a hero slide image; the slide stores the returned address once the section is saved. */
export async function uploadSlideImage(form: FormData): Promise<ActionResult<{ src: string; width: number; height: number }>> {
  const { supabase } = await requireAdmin();
  const uploaded = await uploadImage(supabase, form.get("file"), "anasayfa", MAX_EDGE.slide);
  if ("error" in uploaded) return fail(uploaded.error);
  return { ok: true, data: { src: mediaUrl(uploaded.path), width: uploaded.width, height: uploaded.height } };
}

/* ------------------------------------------------------------------ reference logos */

export async function uploadLogo(form: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const uploaded = await uploadImage(supabase, form.get("file"), "referanslar", MAX_EDGE.logo);
  if ("error" in uploaded) return fail(uploaded.error);
  const { count } = await supabase.from("reference_logos").select("id", { count: "exact", head: true });
  const { error } = await supabase.from("reference_logos").insert({
    storage_path: uploaded.path,
    width: uploaded.width,
    height: uploaded.height,
    name: String(form.get("name") ?? "").trim(),
    sort: count ?? 0,
  });
  if (error) {
    await removeFiles(supabase, [uploaded.path]);
    return fail(dbMessage(error));
  }
  refreshSite();
  return { ok: true };
}

export async function updateLogo(id: string, fields: { name?: string; published?: boolean }): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("reference_logos")
    .update({ ...(fields.name !== undefined ? { name: fields.name.trim() } : {}), ...(fields.published !== undefined ? { published: fields.published } : {}) })
    .eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}

export async function deleteLogo(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("reference_logos").delete().eq("id", id).select("storage_path").single();
  if (error || !data) return fail(dbMessage(error, "Logo silinemedi."));
  await removeFiles(supabase, [data.storage_path]);
  refreshSite();
  return { ok: true };
}
