import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db.from("site_settings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db.from("site_settings").upsert({ key, value: value || null });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
