// Central site config. Set NEXT_PUBLIC_SITE_URL in .env to change the domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://reflax.org").replace(/\/+$/, "");
export const SITE_NAME = "Reflax";
export const SITE_LOGO = `${SITE_URL}/images/global-talent-network.jpg`;
export const SITE_EMAIL = "Contact@reflax.org";
export const SITE_SAME_AS = [
  "https://www.linkedin.com/company/reflaxlimited/",
  "https://www.youtube.com/@Reflaxorg",
  "https://www.facebook.com/share/1CwQuyJQ36/?mibextid=wwXIfr",
];

/** "Social Media Marketing" -> "social-media-marketing" (same rule the category URLs use). */
export function categorySlug(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Turns "/about-us", "about-us" or a full URL into an absolute URL.
 * Returns undefined for empty values and for inline data: images
 * (search engines can't use those).
 */
export function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  const v = (pathOrUrl || "").trim();
  if (!v || v.startsWith("data:")) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  return `${SITE_URL}${v.startsWith("/") ? v : `/${v}`}`;
}
