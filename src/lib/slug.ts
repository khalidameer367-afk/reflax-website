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

/**
 * Resolves the final slug to save for a record. If the admin typed a
 * custom slug, it's sanitized and checked for uniqueness (excluding the
 * record's own current row on edits) — if taken, an error is thrown so
 * the admin can pick a different one. If no custom slug was given, one
 * is generated automatically from the name.
 */
export async function resolveSlug(
  client: SupabaseClient,
  table: string,
  name: string,
  customSlug?: string | null,
  excludeId?: string
): Promise<string> {
  if (customSlug && customSlug.trim()) {
    const clean = slugify(customSlug);
    let query = client.from(table).select("id").eq("slug", clean);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query;
    if (data && data.length > 0) {
      throw new Error(
        `The URL slug "${clean}" is already taken. Please choose a different one.`
      );
    }
    return clean;
  }
  return generateUniqueSlug(client, table, name);
}
