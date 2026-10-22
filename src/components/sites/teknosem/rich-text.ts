// Product descriptions are HTML written in the panel's editor. They are cleaned when saved and again when shown,
// so only the formatting the editor offers ever reaches the page.
import sanitizeHtml from "sanitize-html";

export function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "a", "br", "blockquote"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external: Record<string, string> = /^https?:/i.test(href) ? { target: "_blank", rel: "noopener" } : {};
        return { tagName, attribs: { href, ...external } };
      },
    },
    exclusiveFilter: (frame) => frame.tag === "p" && !frame.text.trim() && !frame.mediaChildren.length,
  }).trim();
}

/** Plain text → HTML paragraphs (used when importing the exported texts). */
export const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
