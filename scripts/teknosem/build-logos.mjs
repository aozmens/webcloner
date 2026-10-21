// Prepares the Teknosem logo files supplied by the client (two PNGs: one for dark areas, one for light areas).
// Trims the transparent margins, writes WebP versions for the site and derives the favicon from the emblem
// of the colour logo. Usage: node scripts/teknosem/build-logos.mjs ["<folder with the two PNGs>"]

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const SOURCE = process.argv[2] ?? "C:/Users/aozme/OneDrive/Desktop/Robotik Sistemler Website";
const FILES = {
  dark: "beyaz_Çalışma Yüzeyi 1.png", // white logo, for dark backgrounds
  light: "26.10.2024 22-02.png", // colour logo with tagline, for light backgrounds
};
const OUT = path.join(root, "public/sites/teknosem/logo");
fs.mkdirSync(OUT, { recursive: true });

const meta = {};
for (const [variant, file] of Object.entries(FILES)) {
  const trimmed = await sharp(path.join(SOURCE, file)).trim({ threshold: 1 }).toBuffer();
  const info = await sharp(trimmed).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, `teknosem-${variant}.webp`));
  meta[variant] = { src: `/sites/teknosem/logo/teknosem-${variant}.webp`, width: info.width, height: info.height };
}

// Emblem = the left part of the colour logo, up to the first fully transparent column after it.
const { data, info } = await sharp(path.join(SOURCE, FILES.light)).trim({ threshold: 1 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const columnHasInk = (x) => {
  for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3] > 8) return true;
  return false;
};
let x = 0;
while (x < info.width && columnHasInk(x)) x++;
while (x < info.width && !columnHasInk(x)) x++; // skip the small gap inside the emblem's pixel squares, if any
let emblemEnd = x;
// The emblem is roughly as wide as it is tall; take the first transparent gap after that point.
for (let col = Math.round(info.height * 0.6); col < info.width; col++) {
  if (!columnHasInk(col)) {
    emblemEnd = col;
    break;
  }
}
const emblem = await sharp(path.join(SOURCE, FILES.light)).trim({ threshold: 1 }).extract({ left: 0, top: 0, width: emblemEnd, height: info.height }).trim({ threshold: 1 }).toBuffer();
const emblemMeta = await sharp(emblem).metadata();
const side = Math.max(emblemMeta.width, emblemMeta.height);
const pad = Math.round(side * 0.14);
const square = await sharp(emblem)
  .extend({
    top: pad + Math.floor((side - emblemMeta.height) / 2),
    bottom: pad + Math.ceil((side - emblemMeta.height) / 2),
    left: pad + Math.floor((side - emblemMeta.width) / 2),
    right: pad + Math.ceil((side - emblemMeta.width) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toBuffer();
await sharp(square).resize(512, 512).png().toFile(path.join(root, "src/app/icon.png"));
await sharp(square).resize(180, 180).flatten({ background: "#ffffff" }).png().toFile(path.join(root, "src/app/apple-icon.png"));

fs.writeFileSync(path.join(root, "src/components/sites/teknosem/content/logo.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(meta, "emblem width", emblemEnd, "of", info.width);
