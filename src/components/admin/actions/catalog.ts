"use server";

import { requireAdmin } from "../auth";
import { dbMessage, fail, refreshSite, type ActionResult } from "../result";
import { isSlug } from "../slug";

const SORTABLE = ["categories", "groups", "products", "product_images", "reference_logos"] as const;
type SortableTable = (typeof SORTABLE)[number];

/** Saves a new order: `ids` from first to last. */
export async function reorder(table: SortableTable, ids: string[]): Promise<ActionResult> {
  if (!SORTABLE.includes(table)) return fail("Geçersiz liste.");
  const { supabase } = await requireAdmin();
  const results = await Promise.all(ids.map((id, index) => supabase.from(table).update({ sort: index }).eq("id", id)));
  const failed = results.find((result) => result.error);
  if (failed) return fail(dbMessage(failed.error, "Sıralama kaydedilemedi."));
  refreshSite();
  return { ok: true };
}

type CatalogInput = { id?: string; title: string; slug: string; published: boolean };

function validate(input: CatalogInput) {
  if (!input.title.trim()) return "Başlık boş olamaz.";
  if (!isSlug(input.slug)) return "Kısa ad yalnızca küçük harf (a-z), rakam ve tire içerebilir. Örnek: robotik-uygulamalar";
  return null;
}

export async function saveCategory(input: CatalogInput): Promise<ActionResult> {
  const invalid = validate(input);
  if (invalid) return fail(invalid);
  const { supabase } = await requireAdmin();
  const row = { title: input.title.trim(), slug: input.slug, published: input.published };
  if (input.id) {
    const { error } = await supabase.from("categories").update(row).eq("id", input.id);
    if (error) return fail(dbMessage(error));
  } else {
    const { count } = await supabase.from("categories").select("id", { count: "exact", head: true });
    const { error } = await supabase.from("categories").insert({ ...row, sort: count ?? 0 });
    if (error) return fail(dbMessage(error));
  }
  refreshSite();
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("groups").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (count) return fail("Bu kategoride gruplar var. Önce grupları silin ya da başka kategoriye taşıyın.");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}

export async function saveGroup(input: CatalogInput & { categoryId: string }): Promise<ActionResult> {
  const invalid = validate(input);
  if (invalid) return fail(invalid);
  if (!input.categoryId) return fail("Bir kategori seçin.");
  const { supabase } = await requireAdmin();
  const row = { title: input.title.trim(), slug: input.slug, published: input.published, category_id: input.categoryId };
  if (input.id) {
    const { error } = await supabase.from("groups").update(row).eq("id", input.id);
    if (error) return fail(dbMessage(error));
  } else {
    const { count } = await supabase.from("groups").select("id", { count: "exact", head: true }).eq("category_id", input.categoryId);
    const { error } = await supabase.from("groups").insert({ ...row, sort: count ?? 0 });
    if (error) return fail(dbMessage(error));
  }
  refreshSite();
  return { ok: true };
}

export async function deleteGroup(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("group_id", id);
  if (count) return fail("Bu grupta ürünler var. Önce ürünleri başka gruba taşıyın ya da silin.");
  const { error } = await supabase.from("groups").delete().eq("id", id);
  if (error) return fail(dbMessage(error));
  refreshSite();
  return { ok: true };
}
