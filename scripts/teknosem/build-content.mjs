// Builds the Teknosem site data from docs/teknosem-icerik (read-only source, not tracked in git).
// Writes src/components/sites/teknosem/content/*.json, converts images to resized WebP and copies PDFs
// into public/sites/teknosem/. Usage: node scripts/teknosem/build-content.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { removeWhiteBackground } from "./transparent.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const SRC = path.join(root, "docs/teknosem-icerik");
const PUBLIC = path.join(root, "public/sites/teknosem");
const OUT = path.join(root, "src/components/sites/teknosem/content");
const URL_BASE = "/sites/teknosem";

/** Longest edge per image family; next/image derives the smaller responsive variants from these. */
const MAX_EDGE = { product: 1800, home: 2560, corporate: 1600, reference: 480 };
const WEBP = { quality: 80, effort: 5 };

const publicUrl = (relative) => `${URL_BASE}/${relative.split(path.sep).join("/")}`;

async function toWebp(from, toRelative, maxEdge, { transparent = false } = {}) {
  const target = path.join(PUBLIC, toRelative.replace(/\.(jpe?g|png|webp)$/i, ".webp"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const resized = sharp(from).rotate().resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true });
  if (!transparent) {
    const info = await resized.webp(WEBP).toFile(target);
    return { src: publicUrl(path.relative(PUBLIC, target)), width: info.width, height: info.height };
  }
  const { data, info } = await resized.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  removeWhiteBackground(data, info.width, info.height);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ ...WEBP, alphaQuality: 90 }).toFile(target);
  return { src: publicUrl(path.relative(PUBLIC, target)), width: info.width, height: info.height };
}

async function convertImages(dir, targetDir, maxEdge, options) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  const images = [];
  for (const file of files) {
    const meta = await sharp(path.join(dir, file)).metadata();
    if ((meta.width ?? 0) < 2) continue; // WordPress slider placeholder (1x1)
    images.push(await toWebp(path.join(dir, file), path.join(targetDir, file.toLowerCase()), maxEdge, options));
  }
  return images;
}

function copyFile(from, toRelative) {
  const to = path.join(PUBLIC, toRelative);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  return publicUrl(toRelative);
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ";") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}

// Images are regenerated from scratch so renamed or dropped sources do not linger in public/.
for (const dir of ["urunler", "kurumsal", "referanslar", "dokumanlar"]) fs.rmSync(path.join(PUBLIC, dir), { recursive: true, force: true });

/**
 * Source PDFs that are kept out of public/ on purpose (see docs/research/teknosem/TODO.md and
 * product-overrides.ts). The TK-7 folder holds a different file that is also named TK-5_V1.5.pdf: its cover
 * says TK-5 and TK-7 is never mentioned, so it is not published until its model is confirmed.
 */
const UNPUBLISHED_DOCUMENTS = { "teknosem-tk-7-otomatik-kepce-kopya": ["TK-5_V1.5.pdf"] };

const csv = parseCsv(fs.readFileSync(path.join(SRC, "00_Urun_Listesi.csv"), "utf8").replace(/^﻿/, ""));
const header = csv[0];
const col = (name) => header.indexOf(name);

const products = [];
for (const r of csv.slice(1)) {
  const folder = path.join(SRC, r[col("Klasör")]);
  const data = JSON.parse(fs.readFileSync(path.join(folder, "veri.json"), "utf8"));
  const sourceUrl = r[col("Sayfa URL")];
  const slug = sourceUrl.replace(/\/$/, "").split("/").pop();
  const docsDir = path.join(folder, "dokumanlar");
  const documents = fs.existsSync(docsDir)
    ? fs
        .readdirSync(docsDir)
        .filter((f) => f.endsWith(".pdf") && !(UNPUBLISHED_DOCUMENTS[slug] ?? []).includes(f))
        // One folder per product: two different source files are both named TK-5_V1.5.pdf (TK-5 and TK-7 folders).
        .map((f) => ({ name: f.replace(/\.pdf$/, ""), src: copyFile(path.join(docsDir, f), path.join("dokumanlar", slug, f)) }))
    : [];
  products.push({
    no: Number(r[col("No")]),
    slug,
    name: data.urun.trim(),
    categories: r[col("Kategori")].split(",").map((s) => s.trim()),
    sourceUrl,
    sourceUrlEn: data.seo.hreflang?.en ?? null,
    shortDescription: data.kisa_aciklama.trim(),
    tabs: data.sekmeler.map((tab) => ({ title: tab.baslik, markdown: tab.metin, videos: tab.videolar })),
    videos: data.videolar,
    images: await convertImages(path.join(folder, "gorseller"), path.join("urunler", slug), MAX_EDGE.product, { transparent: true }),
    documents,
    seo: { title: data.seo.title, description: data.seo.meta?.description ?? "" },
  });
}

const kurumsal = path.join(SRC, "02_Kurumsal");
const media = {
  home: await convertImages(path.join(kurumsal, "11_Anasayfa/gorseller"), "kurumsal/anasayfa", MAX_EDGE.home),
  about: await convertImages(path.join(kurumsal, "01_Hakkimizda/gorseller"), "kurumsal/hakkimizda", MAX_EDGE.corporate),
  contact: await convertImages(path.join(kurumsal, "02_Iletisim/gorseller"), "kurumsal/iletisim", MAX_EDGE.corporate),
  products: await convertImages(path.join(kurumsal, "12_Urunler_Sayfasi/gorseller"), "kurumsal/urunler", MAX_EDGE.home),
  references: await convertImages(path.join(kurumsal, "06_Referanslar/gorseller"), "referanslar", MAX_EDGE.reference, { transparent: true }),
};

/** Neutral stand-in for products whose real photos are still missing (see docs/research/teknosem/TODO.md). */
async function placeholder(label, file) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <rect x="360" y="420" width="480" height="300" rx="28" fill="none" stroke="#5b6270" stroke-width="10"/>
    <circle cx="470" cy="520" r="38" fill="#5b6270"/>
    <path d="M380 700 L540 560 L640 650 L720 590 L820 700 Z" fill="#5b6270"/>
    <text x="600" y="830" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#cbcbcb">${label}</text>
    <text x="600" y="900" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="40" fill="#8a909b">Görsel hazırlanıyor</text>
  </svg>`;
  const target = path.join(PUBLIC, "gecici", file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const info = await sharp(Buffer.from(svg)).webp(WEBP).toFile(target);
  return { src: publicUrl(path.relative(PUBLIC, target)), width: info.width, height: info.height };
}

const placeholders = { "ty-2000": await placeholder("TY-2000", "ty-2000.webp") };

/** "Sayfa Metni" section of a corporate page, split into paragraphs. */
function pageText(dir) {
  const md = fs.readFileSync(path.join(kurumsal, dir, "icerik.md"), "utf8");
  const body = md.split("## Sayfa Metni")[1].split(/\n## (Bağlantılar|Görseller|Gömülü)/)[0];
  return body.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
}

fs.writeFileSync(path.join(OUT, "kvkk.json"), JSON.stringify(pageText("04_KVKK"), null, 2) + "\n");

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "placeholders.json"), JSON.stringify(placeholders, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "products.json"), JSON.stringify(products, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "media.json"), JSON.stringify(media, null, 2) + "\n");
console.log(`products: ${products.length}, product images: ${products.reduce((n, p) => n + p.images.length, 0)}, references: ${media.references.length}`);
