/**
 * Freelancer bios are now rich text (HTML) written in the admin panel, but
 * older bios — and bios typed by freelancers in their dashboard — are plain
 * text. `bioToHtml` turns either into safe HTML:
 *  - plain text  → escaped, with blank lines becoming paragraphs
 *  - HTML        → run through a small allow-list sanitizer
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u",
  "ul", "ol", "li", "a", "img", "blockquote",
]);
const VOID_TAGS = new Set(["br", "img"]);

function escapeText(s: string): string {
  return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getAttr(attrs: string, name: string): string | null {
  const m = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i"));
  if (!m) return null;
  return (m[1] ?? m[2] ?? m[3] ?? "").trim();
}

function safeHref(raw: string | null): string | null {
  if (!raw) return null;
  // eslint-disable-next-line no-control-regex
  const url = raw.replace(/[\u0000-\u001f\u007f\s]+/g, "");
  return /^(https?:|mailto:|tel:|\/(?!\/)|#)/i.test(url) ? raw.trim() : null;
}

function safeImgSrc(raw: string | null): string | null {
  if (!raw) return null;
  // eslint-disable-next-line no-control-regex
  const url = raw.replace(/[\u0000-\u001f\u007f\s]+/g, "");
  return /^(https:\/\/|data:image\/(png|jpe?g|webp|gif);base64,)/i.test(url) ? url : null;
}

export function sanitizeBioHtml(html: string): string {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|svg|math)\b[\s\S]*?<\/\1\s*>/gi, "");

  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(cleaned))) {
    out += escapeText(cleaned.slice(last, m.index));
    last = m.index + m[0].length;
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    const attrs = m[3] || "";
    if (!ALLOWED_TAGS.has(tag)) continue; // drop the tag, keep its text

    if (closing) {
      if (!VOID_TAGS.has(tag)) out += `</${tag}>`;
      continue;
    }
    if (tag === "a") {
      const href = safeHref(getAttr(attrs, "href"));
      out += href ? `<a href="${escapeAttr(href)}">` : "<a>";
    } else if (tag === "img") {
      const src = safeImgSrc(getAttr(attrs, "src"));
      if (src) out += `<img src="${escapeAttr(src)}" alt="${escapeAttr(getAttr(attrs, "alt") || "")}" loading="lazy" />`;
    } else if (tag === "br") {
      out += "<br />";
    } else {
      out += `<${tag}>`;
    }
  }
  out += escapeText(cleaned.slice(last));
  return out;
}

export function bioToHtml(bio: string | null | undefined): string {
  const text = (bio || "").trim();
  if (!text) return "";
  if (/<[a-zA-Z][^>]*>/.test(text)) return sanitizeBioHtml(text);
  // Legacy plain text
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeText(para).replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, "&amp;").replace(/\n/g, "<br />")}</p>`)
    .join("");
}
