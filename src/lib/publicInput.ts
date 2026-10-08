// Helpers for cleaning text that comes from public (not logged-in) forms.

export function cleanText(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function escapeHtml(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Turns plain text typed by a visitor into safe HTML paragraphs.
export function plainToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

// Returns a safe http(s) URL, or "" if the value is empty / not a valid web address.
export function cleanUrl(v: unknown): string {
  const raw = cleanText(v, 300);
  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withProtocol);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

// Only accept small JPEG data URLs produced by our own image resizer.
export function cleanImageDataUrl(v: unknown, maxChars = 700_000): string | null {
  if (typeof v !== "string") return null;
  if (!v.startsWith("data:image/jpeg;base64,")) return null;
  if (v.length > maxChars) return null;
  return v;
}
