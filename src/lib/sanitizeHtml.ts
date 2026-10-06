// Lightweight, dependency-free sanitizer for rich text that is rendered with
// dangerouslySetInnerHTML (used for freelancer bios, which can also come from
// the public registration form, not just the admin panel).
//
// Allowed: headings, paragraphs, bold/italic, lists, links, images, quotes.
// Everything else (script, style, iframe, on* handlers, javascript: URLs...) is removed.

const ALLOWED_TAGS = new Set([
  "h2", "h3", "h4", "p", "br", "b", "strong", "i", "em", "u",
  "ul", "ol", "li", "a", "img", "blockquote", "div", "span",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ["href", "title", "target"],
  img: ["src", "alt", "title", "style"],
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function safeUrl(value: string, isImage: boolean): string | null {
  const v = value.trim();
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(v)) return v;
  if (isImage && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(v)) return v;
  return null;
}

/** True when the string contains no HTML tags (old plain-text bios). */
export function isPlainText(input: string): boolean {
  return !/<\/?[a-z][\s\S]*>/i.test(input);
}

export function sanitizeHtml(input: string | null | undefined): string {
  const html = (input || "").trim();
  if (!html) return "";

  // Old / self-registered bios are plain text: keep their line breaks as paragraphs.
  if (isPlainText(html)) {
    return html
      .split(/\n{2,}/)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }

  // Drop dangerous containers together with their content.
  let out = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|math|link|meta|base)[^>]*>/gi, "");

  out = out.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const closing = match.startsWith("</");
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (closing) return `</${tag}>`;

    const allowed = ALLOWED_ATTRS[tag] || [];
    let attrs = "";
    const attrRe = /([a-z-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(rawAttrs))) {
      const name = m[1].toLowerCase();
      const value = m[3] ?? m[4] ?? m[5] ?? "";
      if (!allowed.includes(name)) continue;
      if (name === "href" || name === "src") {
        const url = safeUrl(value, tag === "img");
        if (!url) continue;
        attrs += ` ${name}="${escapeHtml(url)}"`;
      } else if (name === "style") {
        // Only keep the harmless sizing style the editor adds to images.
        if (/^[\w\s:;.%-]*$/.test(value)) attrs += ` style="${escapeHtml(value)}"`;
      } else if (name === "target") {
        attrs += ` target="_blank"`;
      } else {
        attrs += ` ${name}="${escapeHtml(value)}"`;
      }
    }
    if (tag === "a") {
      const external = /href="https?:/i.test(attrs);
      if (external) attrs += ` rel="noopener noreferrer"`;
    }
    return `<${tag}${attrs}>`;
  });

  return out;
}
