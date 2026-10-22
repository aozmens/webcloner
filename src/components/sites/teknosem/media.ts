// Static corporate images that stay in public/ (page backgrounds, hero and corporate photos). Product images,
// manuals and reference logos live in Supabase Storage and come from the database.

import mediaJson from "./content/media.json";

/** An image with its intrinsic size. `src` is a site path (/sites/...) or an absolute Storage URL. */
export type ImageAsset = { src: string; width: number; height: number; alt?: string };

export const media = mediaJson as Record<"home" | "about" | "contact" | "products", ImageAsset[]>;

export const mediaByName = (list: ImageAsset[], name: string) => {
  const found = list.find((image) => image.src.includes(name));
  if (!found) throw new Error(`Missing Teknosem image: ${name}`);
  return found;
};
