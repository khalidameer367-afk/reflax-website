import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Redirect rules are loaded once and cached in memory for a minute, instead of
// hitting the database on every single page view / prefetch (which made every
// navigation wait on an extra network round trip).
const TTL_MS = 60_000;
let cache: { at: number; map: Map<string, string> } | null = null;

async function getRedirects(): Promise<Map<string, string>> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.map;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
    const { data, error } = await supabase
      .from("redirects")
      .select("source_path,destination_path")
      .limit(2000);
    if (error) throw error;
    const map = new Map<string, string>();
    for (const r of data ?? []) {
      if (r.source_path && r.destination_path) map.set(r.source_path, r.destination_path);
    }
    cache = { at: now, map };
    return map;
  } catch {
    // Lookup failed: keep serving the old rules (or none) and retry in ~10s.
    const map = cache?.map ?? new Map<string, string>();
    cache = { at: now - (TTL_MS - 10_000), map };
    return map;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const redirects = await getRedirects();
  const destination = redirects.get(pathname);
  if (destination) {
    return NextResponse.redirect(new URL(destination, req.url));
  }
  return NextResponse.next();
}

// Skip Next.js internals, API routes, and static files (anything with a dot).
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
