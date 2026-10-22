"use server";

import type { Json } from "@/lib/supabase/database.types";
import { cleanHtml } from "@/components/sites/teknosem/rich-text";
import { requireAdmin } from "../auth";
import { MAX_EDGE, removeFiles, uploadImage } from "../media-server";
import { dbMessage, fail, refreshSite, type ActionResult } from "../result";
import { isSlug } from "../slug";

export type ProductInput = {
  id?: string;
  name: string;
  shortName: string;
  slug: string;
  groupId: string;
  shortDescription: string;
  descriptionHtml: string;
  specs: { label: string; value: string }[];
  faqTitle: string;
  faq: { question: string; answer: string }[];
  videos: string[];
  published: boolean;
  seoTitle: string;
  seoDescription: string;
};

const isYoutube = (url: string) => /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//.test(url);

export async function saveProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  const name = input.name.trim();
  if (!name) return fail("Ürün adı boş olamaz.");
  if (!isSlug(input.slug)) return fail("Kısa ad yalnızca küçük harf (a-z), rakam ve tire içerebilir. Örnek: ty-1000");
  if (!input.groupId) return fail("Ürünün görüneceği grubu seçin.");
  const videos = input.videos.map((url) => url.trim()).filter(Boolean);
  const badVideo = videos.find((url) => !isYoutube(url));
  if (badVideo) return fail(`Video bağlantısı YouTube adresi olmalı: ${badVideo}`);

  const row = {
    name,
    short_name: input.shortName.trim(),
    slug: input.slug,
    group_id: input.groupId,
    short_description: input.shortDescription.trim(),
    description_html: cleanHtml(input.descriptionHtml),
    specs: input.specs.map((s) => ({ label: s.label.trim(), value: s.value.trim() })).filter((s) => s.label) as Json,
    faq_title: input.faqTitle.trim() || "Sıkça Sorulan Sorular",
    faq: input.faq.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })).filter((f) => f.question) as Json,
    videos,
    published: input.published,
    seo_title: input.seoTitle.trim(),
    seo_description: input.seoDescription.trim(),
  };

  const { supabase } = await requireAdmin();
  if (input.id) {
    const { error } = await supabase.from("products").update(row).eq("id", input.id);
    if (error) return fail(dbMessage(error));
    refreshSite();
    return { ok: true, data: { id: input.id } };
  }
  // New products go to the end of their group.
  const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("group_id", input.groupId);
  const { data, error } = await supabase
    .from("products")
    .insert({ ...row, sort: count ?? 0 })
    .select("id")
    .single();
  if (error || !data) return fail(dbMessage(error));
  refreshSite();
  return { ok: true, data: { id: data.id } };
}

export async function setProductPublished(id: string, published: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").update({ published }).eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: images } = await supabase.from("product_images").select("storage_path").eq("product_id", id);
  // Manuals stay in İndirmeler (unlinked) so a shared PDF link keeps working; images are removed with the product.
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return fail(dbMessage(error));
  await removeFiles(
    supabase,
    (images ?? []).map((image) => image.storage_path),
  );
  refreshSite();
  return { ok: true };
}

export async function uploadProductImage(productId: string, form: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: product } = await supabase.from("products").select("slug").eq("id", productId).single();
  if (!product) return fail("Ürün bulunamadı.");
  const uploaded = await uploadImage(supabase, form.get("file"), `urunler/${product.slug}`, MAX_EDGE.product);
  if ("error" in uploaded) return fail(uploaded.error);
  const { count } = await supabase.from("product_images").select("id", { count: "exact", head: true }).eq("product_id", productId);
  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: uploaded.path,
    width: uploaded.width,
    height: uploaded.height,
    alt: String(form.get("alt") ?? "").trim(),
    sort: count ?? 0,
  });
  if (error) {
    await removeFiles(supabase, [uploaded.path]);
    return fail(dbMessage(error));
  }
  refreshSite();
  return { ok: true };
}

export async function updateProductImageAlt(id: string, alt: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("product_images").update({ alt: alt.trim() }).eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}

export async function deleteProductImage(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("product_images").delete().eq("id", id).select("storage_path").single();
  if (error || !data) return fail(dbMessage(error, "Görsel silinemedi."));
  await removeFiles(supabase, [data.storage_path]);
  refreshSite();
  return { ok: true };
}
