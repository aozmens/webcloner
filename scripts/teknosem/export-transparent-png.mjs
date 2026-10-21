// Replaces the product images and reference logos in docs/teknosem-icerik with full-resolution transparent PNGs
// (white studio background removed, same method as the site build). Originals are moved first to
// docs/teknosem-icerik/_orijinal_yedek/<same path>, so nothing is lost. The icerik.md image lists are updated
// to the new .png names. Safe to re-run: files already backed up are skipped.
// Usage: node scripts/teknosem/export-transparent-png.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { removeWhiteBackground } from "./transparent.mjs";

// sharp keeps input files open on Windows unless caching is off and inputs are read into memory first.
sharp.cache(false);

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const SRC = path.join(root, "docs/teknosem-icerik");
const BACKUP = path.join(SRC, "_orijinal_yedek");

const productDirs = fs
  .readdirSync(path.join(SRC, "01_Urunler"))
  .flatMap((category) => fs.readdirSync(path.join(SRC, "01_Urunler", category)).map((p) => path.join(SRC, "01_Urunler", category, p)));
const targets = [...productDirs.map((dir) => path.join(dir, "gorseller")), path.join(SRC, "02_Kurumsal/06_Referanslar/gorseller")].filter((dir) => fs.existsSync(dir));

let converted = 0;
for (const dir of targets) {
  const renames = [];
  for (const file of fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
    const from = path.join(dir, file);
    const rel = path.relative(SRC, from);
    const backup = path.join(BACKUP, rel);
    // Already converted: an original with the same name (any extension) is in the backup.
    const backupDir = path.dirname(backup);
    const stem = path.parse(file).name;
    if (fs.existsSync(backupDir) && fs.readdirSync(backupDir).some((f) => path.parse(f).name === stem)) continue;
    const { data, info } = await sharp(fs.readFileSync(from)).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    removeWhiteBackground(data, info.width, info.height);
    const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9 }).toBuffer();
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.renameSync(from, backup);
    const pngName = file.replace(/\.(jpe?g|png|webp)$/i, ".png");
    fs.writeFileSync(path.join(dir, pngName), png);
    renames.push([file, pngName]);
    converted++;
  }
  // Keep the "Görseller" list in icerik.md pointing at the new files.
  const md = path.join(path.dirname(dir), "icerik.md");
  if (renames.length && fs.existsSync(md)) {
    let text = fs.readFileSync(md, "utf8");
    for (const [oldName, newName] of renames) text = text.split(`gorseller/${oldName}`).join(`gorseller/${newName}`);
    fs.writeFileSync(md, text);
  }
}
console.log(`converted ${converted} images; originals in ${path.relative(root, BACKUP)}`);
