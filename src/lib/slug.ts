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

/**
 * When an admin changes a slug (or a freelancer's category, which is part of the URL),
 * the old URL must keep working — otherwise Google/backlinks hit a 404.
 * This adds a redirect old → new in the existing `redirects` table (which the
 * middleware already serves) and keeps older redirects pointing at the newest URL.
 */
export async function recordPathChange(db: SupabaseClient, oldPath: string, newPath: string) {
  if (!oldPath || !newPath || oldPath === newPath) return;
  // A redirect FROM the new path would create a loop (e.g. renaming back).
  await db.from("redirects").delete().eq("source_path", newPath);
  // Older redirects that pointed at the old path now go straight to the new one.
  await db.from("redirects").update({ destination_path: newPath }).eq("destination_path", oldPath);
  await db.from("redirects").upsert({ source_path: oldPath, destination_path: newPath }, { onConflict: "source_path" });
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
