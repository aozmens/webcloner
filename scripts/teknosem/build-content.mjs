// Builds the Teknosem site data from docs/teknosem-icerik (read-only source).
// Writes src/components/sites/teknosem/content/*.json and copies images/PDFs into public/sites/teknosem/.
// Usage: node scripts/teknosem/build-content.mjs

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const SRC = path.join(root, "docs/teknosem-icerik");
const PUBLIC = path.join(root, "public/sites/teknosem");
const OUT = path.join(root, "src/components/sites/teknosem/content");
const URL_BASE = "/sites/teknosem";

function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.subarray(1, 4).toString() === "PNG") return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  if (b.subarray(8, 12).toString() === "WEBP") {
    const chunk = b.subarray(12, 16).toString();
    if (chunk === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (chunk === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (chunk === "VP8L") { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
  }
  throw new Error(`Unknown image format: ${file}`);
}

function copy(from, toRelative) {
  const to = path.join(PUBLIC, toRelative);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (!fs.existsSync(to) || fs.statSync(to).size !== fs.statSync(from).size) fs.copyFileSync(from, to);
  return `${URL_BASE}/${toRelative.split(path.sep).join("/")}`;
}

function copyImages(dir, targetDir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => {
      const [width, height] = imageSize(path.join(dir, f));
      return { src: copy(path.join(dir, f), path.join(targetDir, f.toLowerCase())), width, height };
    });
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

const csv = parseCsv(fs.readFileSync(path.join(SRC, "00_Urun_Listesi.csv"), "utf8").replace(/^﻿/, ""));
const header = csv[0];
const col = (name) => header.indexOf(name);

const products = csv.slice(1).map((r) => {
  const folder = path.join(SRC, r[col("Klasör")]);
  const data = JSON.parse(fs.readFileSync(path.join(folder, "veri.json"), "utf8"));
  const sourceUrl = r[col("Sayfa URL")];
  const slug = sourceUrl.replace(/\/$/, "").split("/").pop();
  const docsDir = path.join(folder, "dokumanlar");
  const documents = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((f) => f.endsWith(".pdf")).map((f) => ({ name: f.replace(/\.pdf$/, ""), src: copy(path.join(docsDir, f), path.join("dokumanlar", f)) }))
    : [];
  return {
    no: Number(r[col("No")]),
    slug,
    name: data.urun.trim(),
    categories: r[col("Kategori")].split(",").map((s) => s.trim()),
    sourceUrl,
    shortDescription: data.kisa_aciklama.trim(),
    tabs: data.sekmeler.map((tab) => ({ title: tab.baslik, markdown: tab.metin, videos: tab.videolar })),
    videos: data.videolar,
    images: copyImages(path.join(folder, "gorseller"), path.join("urunler", slug)),
    documents,
    seo: { title: data.seo.title, description: data.seo.meta?.description ?? "" },
  };
});

const kurumsal = path.join(SRC, "02_Kurumsal");
const media = {
  home: copyImages(path.join(kurumsal, "11_Anasayfa/gorseller"), "kurumsal/anasayfa").filter((i) => i.width > 1),
  about: copyImages(path.join(kurumsal, "01_Hakkimizda/gorseller"), "kurumsal/hakkimizda"),
  contact: copyImages(path.join(kurumsal, "02_Iletisim/gorseller"), "kurumsal/iletisim"),
  products: copyImages(path.join(kurumsal, "12_Urunler_Sayfasi/gorseller"), "kurumsal/urunler"),
  references: copyImages(path.join(kurumsal, "06_Referanslar/gorseller"), "referanslar"),
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "products.json"), JSON.stringify(products, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "media.json"), JSON.stringify(media, null, 2) + "\n");
console.log(`products: ${products.length}, images: ${products.reduce((n, p) => n + p.images.length, 0)}, references: ${media.references.length}`);
