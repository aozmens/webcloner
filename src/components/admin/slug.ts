// Shared by the panel forms (suggested slug while typing) and the server actions (validation).

/** "Robotik Zımpara 2" → "robotik-zimpara-2". */
export function slugify(text: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };
  return text
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (char) => map[char] ?? char)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const isSlug = (value: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
