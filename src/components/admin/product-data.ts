// Loads what the product form needs from the database.
import "server-only";
import type { Json } from "@/lib/supabase/database.types";
import { readFaq, readSpecs } from "@/components/sites/teknosem/site-data";
import type { ProductInput } from "./actions/products";
import type { requireAdmin } from "./auth";
import type { GroupOption } from "./product-form";

type Client = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

export async function loadGroupOptions(supabase: Client): Promise<GroupOption[]> {
  const [categories, groups] = await Promise.all([
    supabase.from("categories").select("id, title").order("sort"),
    supabase.from("groups").select("id, title, category_id").order("sort"),
  ]);
  const titles = new Map((categories.data ?? []).map((c) => [c.id, c.title]));
  const order = new Map((categories.data ?? []).map((c, index) => [c.id, index]));
  return (groups.data ?? [])
    .toSorted((a, b) => (order.get(a.category_id) ?? 0) - (order.get(b.category_id) ?? 0))
    .map((group) => ({ id: group.id, title: group.title, category: titles.get(group.category_id) ?? "" }));
}

export const emptyProduct = (groupId = ""): ProductInput => ({
  name: "",
  shortName: "",
  slug: "",
  groupId,
  shortDescription: "",
  descriptionHtml: "",
  specs: [],
  faqTitle: "Sıkça Sorulan Sorular",
  faq: [],
  videos: [],
  published: false,
  seoTitle: "",
  seoDescription: "",
});

export const toProductInput = (row: {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  group_id: string;
  short_description: string;
  description_html: string;
  specs: Json;
  faq_title: string;
  faq: Json;
  videos: string[];
  published: boolean;
  seo_title: string;
  seo_description: string;
}): ProductInput => ({
  id: row.id,
  name: row.name,
  shortName: row.short_name,
  slug: row.slug,
  groupId: row.group_id,
  shortDescription: row.short_description,
  descriptionHtml: row.description_html,
  specs: readSpecs(row.specs),
  faqTitle: row.faq_title,
  faq: readFaq(row.faq),
  videos: row.videos,
  published: row.published,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
});
