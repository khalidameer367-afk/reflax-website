import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db.from("page_seo").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data });
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { page_key, meta_title, meta_description, canonical_url, focus_keyword } = body;
  if (!page_key) return NextResponse.json({ error: "Missing page_key" }, { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db
    .from("page_seo")
    .upsert(
      {
        page_key,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        canonical_url: canonical_url || null,
        focus_keyword: focus_keyword || null,
      },
      { onConflict: "page_key" }
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
