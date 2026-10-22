// One-off import of the current Teknosem content into Supabase: catalog, products, product images, manuals,
// reference logos and the editable site texts. Source: the build-content.mjs output (src/components/sites/
// teknosem/content/*.json and public/sites/teknosem/), with the corrections in seed.ts applied.
//
//   npx tsx --env-file=.env.local scripts/teknosem/import-to-supabase.mts            # adds what is missing
//   npx tsx --env-file=.env.local scripts/teknosem/import-to-supabase.mts --guncelle # also overwrites existing rows
//
// Safe to run again: rows are matched by slug / file path, so nothing is duplicated. Without --guncelle, rows
// and files that already exist are left alone, so changes made in the panel are never overwritten.

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "../../src/lib/supabase/database.types";
import { parseTab, type Block } from "../../src/components/sites/teknosem/product-markdown";
import { productOverrides } from "../../src/components/sites/teknosem/product-overrides";
import { escapeHtml } from "../../src/components/sites/teknosem/rich-text";
import { catalog, products, referenceLogos, shortName, type Product } from "../../src/components/sites/teknosem/seed";
import { defaultSettings, settingKeys } from "../../src/components/sites/teknosem/settings";

const BUCKET = "media";
const overwrite = process.argv.includes("--guncelle");
const root = path.resolve(import.meta.dirname, "../..");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli (.env.local). Çalıştırma: npx tsx --env-file=.env.local ...");
  process.exit(1);
}
const db = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const stats = { categories: 0, groups: 0, products: 0, images: 0, uploads: 0, downloads: 0, logos: 0, settings: 0 };

function fail(what: string, error: { message: string } | null): never {
  throw new Error(`${what}: ${error?.message ?? "bilinmeyen hata"}`);
}

/** Inserts the row, or updates it with --guncelle; returns the id either way. */
async function upsertBySlug(table: "categories" | "groups" | "products", row: { slug: string } & Record<string, unknown>) {
  // The three tables share id/slug, which is all this needs; typed through one of them.
  const from = () => db.from(table as "categories");
  const { data: existing, error } = await from().select("id").eq("slug", row.slug).maybeSingle();
  if (error) fail(`${table} okunamadı`, error);
  if (existing && !overwrite) return { id: existing.id, created: false };
  const result = existing
    ? await from().update(row as never).eq("id", existing.id).select("id").single()
    : await from().insert(row as never).select("id").single();
  if (result.error || !result.data) fail(`${table} yazılamadı (${row.slug})`, result.error);
  return { id: result.data.id, created: !existing };
}

/** Uploads a local file to Storage unless it is already there. */
async function upload(localPath: string, storagePath: string, contentType: string) {
  const body = fs.readFileSync(localPath);
  const { error } = await db.storage.from(BUCKET).upload(storagePath, body, { contentType, upsert: overwrite, cacheControl: "31536000" });
  if (error && !/exists|duplicate/i.test(error.message)) fail(`Yüklenemedi: ${storagePath}`, error);
  if (!error) stats.uploads++;
  return body.length;
}

const publicFile = (src: string) => path.join(root, "public", ...src.split("/").filter(Boolean));

/* ------------------------------------------------------------------ product text → panel format */

function blocksToHtml(blocks: Block[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return block.level <= 2 ? `<h2>${escapeHtml(block.text)}</h2>` : `<h3>${escapeHtml(block.text)}</h3>`;
        case "paragraph":
          return `<p>${escapeHtml(block.text)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li><p>${escapeHtml(item)}</p></li>`).join("")}</ul>`;
        case "table":
          return block.rows.map(([label, value]) => `<p>${escapeHtml(value ? `${label}: ${value}` : label)}</p>`).join("");
      }
    })
    .join("");
}

const youtube = (videoUrl: string) => /youtube(-nocookie)?\.com|youtu\.be/.test(videoUrl);

function productContent(p: Product) {
  const tab = (title: string) => p.tabs.find((t) => t.title === title);
  const descriptionTab = tab("Açıklama") ?? p.tabs[0];
  const description = parseTab(descriptionTab.markdown, descriptionTab.title);
  const specsTab = tab("Teknik Detaylar");
  const specs = specsTab ? parseTab(specsTab.markdown, specsTab.title).blocks.flatMap((block) => (block.type === "table" ? block.rows : [])) : [];
  const videos = [...new Set([...(tab("Video")?.videos ?? []), ...p.videos])].filter(youtube);
  return {
    description_html: blocksToHtml(description.blocks),
    specs: specs.map(([label, value]) => ({ label, value })) as Json,
    faq_title: description.faqTitle || "Sıkça Sorulan Sorular",
    faq: description.faq.map((item) => ({ question: item.question, answer: item.answer.join("\n") })) as Json,
    videos,
  };
}

/** "14.03.2025" → "2025-03-14". */
const isoDate = (date: string) => {
  const match = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
};

/* ------------------------------------------------------------------ import */

async function importCatalog() {
  for (const [categoryIndex, category] of catalog.entries()) {
    const c = await upsertBySlug("categories", { slug: category.slug, title: category.title, sort: categoryIndex, published: true });
    if (c.created) stats.categories++;
    for (const [groupIndex, group] of category.groups.entries()) {
      const g = await upsertBySlug("groups", { slug: group.slug, title: group.title, category_id: c.id, sort: groupIndex, published: true });
      if (g.created) stats.groups++;
      for (const [productIndex, slug] of group.products.entries()) {
        const p = products.find((candidate) => candidate.slug === slug);
        if (!p) throw new Error(`Katalogdaki ürün bulunamadı: ${slug}`);
        const row = await upsertBySlug("products", {
          slug: p.slug,
          legacy_slug: p.sourceSlug,
          name: p.name,
          short_name: shortName(p),
          group_id: g.id,
          sort: productIndex,
          short_description: p.shortDescription,
          ...productContent(p),
          published: true,
          seo_title: "",
          seo_description: p.seo.description,
        });
        if (row.created) stats.products++;
        await importImages(p, row.id);
        await importManuals(p, row.id);
      }
    }
  }
}

async function importImages(p: Product, productId: string) {
  for (const [index, image] of p.images.entries()) {
    const storagePath = `urunler/${p.slug}/${path.basename(image.src)}`;
    await upload(publicFile(image.src), storagePath, "image/webp");
    const { data, error } = await db
      .from("product_images")
      .upsert({ product_id: productId, storage_path: storagePath, width: image.width, height: image.height, sort: index, alt: "" }, { onConflict: "product_id,storage_path", ignoreDuplicates: !overwrite })
      .select("id");
    if (error) fail(`Görsel kaydı yazılamadı (${storagePath})`, error);
    stats.images += data?.length ?? 0;
  }
}

async function addDownload(row: Database["public"]["Tables"]["downloads"]["Insert"]) {
  const { data, error } = await db.from("downloads").upsert(row, { onConflict: "storage_path", ignoreDuplicates: !overwrite }).select("id");
  if (error) fail(`İndirme kaydı yazılamadı (${row.storage_path})`, error);
  stats.downloads += data?.length ?? 0;
}

async function importManuals(p: Product, productId: string) {
  for (const doc of p.documents) {
    const storagePath = `dokumanlar/${p.slug}/${path.basename(doc.src)}`;
    const size = await upload(publicFile(doc.src), storagePath, "application/pdf");
    await addDownload({
      product_id: productId,
      title: `${doc.model} Kullanım Kılavuzu`,
      model: doc.model,
      version: doc.version,
      release_date: isoDate(doc.date),
      note: doc.uncertain ?? "",
      storage_path: storagePath,
      size_bytes: size,
      published: true,
    });
  }

  // TK-7: the file in its source folder is a different manual whose cover says TK-5 (see product-overrides.ts).
  // It is kept in the panel as unpublished until its model is confirmed.
  if (p.slug === "tk-7") {
    const source = path.join(root, "docs/teknosem-icerik/01_Urunler/HPDC Robot Sistemleri/21 - TEKNOSEM TK-7 Otomatik Kepçe/dokumanlar/TK-5_V1.5.pdf");
    if (!fs.existsSync(source)) {
      console.warn("Uyarı: TK-7 klasöründeki PDF bulunamadı, atlandı:", source);
      return;
    }
    const storagePath = "dokumanlar/tk-7/TK-5_V1.5-tk7-klasoru.pdf";
    const size = await upload(source, storagePath, "application/pdf");
    await addDownload({
      product_id: productId,
      title: "TK-7 Kullanım Kılavuzu",
      model: "TK-5",
      version: "V1.5",
      release_date: null,
      note: productOverrides["tk-7"].reason,
      storage_path: storagePath,
      size_bytes: size,
      published: false,
    });
  }
}

async function importLogos() {
  for (const [index, logo] of referenceLogos.entries()) {
    const storagePath = `referanslar/${path.basename(logo.src)}`;
    await upload(publicFile(logo.src), storagePath, "image/webp");
    const { data, error } = await db
      .from("reference_logos")
      .upsert({ storage_path: storagePath, width: logo.width, height: logo.height, sort: index, name: "", published: true }, { onConflict: "storage_path", ignoreDuplicates: !overwrite })
      .select("id");
    if (error) fail(`Logo kaydı yazılamadı (${storagePath})`, error);
    stats.logos += data?.length ?? 0;
  }
}

async function importSettings() {
  for (const key of settingKeys) {
    const { data, error } = await db
      .from("site_settings")
      .upsert({ key, value: defaultSettings[key] as unknown as Json }, { onConflict: "key", ignoreDuplicates: !overwrite })
      .select("key");
    if (error) fail(`Site metni yazılamadı (${key})`, error);
    stats.settings += data?.length ?? 0;
  }
}

await importCatalog();
await importLogos();
await importSettings();
console.log(`${overwrite ? "Güncellendi/eklendi" : "Eklendi"}:`, stats);
