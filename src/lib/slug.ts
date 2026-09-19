import type { SupabaseClient } from "@supabase/supabase-js";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "item";
}

/**
 * Generates a unique slug for a table by checking existing slugs that
 * start with the base and appending -2, -3, etc. if needed.
 */
export async function generateUniqueSlug(
  client: SupabaseClient,
  table: string,
  name: string
): Promise<string> {
  const base = slugify(name);
  const { data } = await client
    .from(table)
    .select("slug")
    .like("slug", `${base}%`);

  const existing = new Set((data || []).map((r: { slug: string }) => r.slug));
  if (!existing.has(base)) return base;

  let n = 2;
  while (existing.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
