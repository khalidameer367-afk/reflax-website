import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
    const { data } = await supabase
      .from("redirects")
      .select("destination_path, redirect_type, is_active")
      .eq("source_path", pathname)
      .eq("is_active", true)
      .maybeSingle();

    if (data?.destination_path) {
      const status = data.redirect_type === 302 ? 302 : 301;
      return NextResponse.redirect(new URL(data.destination_path, req.url), status);
    }
  } catch {
    // If the redirect lookup fails for any reason, don't block the request.
  }

  return NextResponse.next();
}

// Skip Next.js internals, API routes, and static files (anything with a dot).
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
