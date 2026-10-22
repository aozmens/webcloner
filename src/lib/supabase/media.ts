// Public URLs of files in the "media" Storage bucket. Safe for the browser.
import { publicEnv } from "@/lib/public-env";

export const MEDIA_BUCKET = "media";

export const mediaUrl = (path: string) =>
  `${publicEnv.supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
