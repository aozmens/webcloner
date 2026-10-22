// Shrinks a photo in the browser before upload, so phone pictures (often 5–15 MB) stay well under the server's
// request limit. The server converts the result to WebP again; this step only reduces the upload.

export async function shrinkImage(file: File, maxEdge: number): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // Format the browser cannot decode (e.g. HEIC on some browsers): let the server try.
  }
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  // WebP keeps transparency (product renders); browsers that cannot encode it return PNG instead.
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + (blob.type === "image/webp" ? ".webp" : ".png"), { type: blob.type });
}
