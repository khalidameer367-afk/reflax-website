import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";

function normalizePath(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("redirects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ redirects: data });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { source_path, destination_path, redirect_type, is_active } = await req.json();
  if (!source_path || !destination_path) {
    return NextResponse.json({ error: "Both source and destination URLs are required." }, { status: 400 });
  }
  const type = redirect_type === 302 ? 302 : 301;
  const source = normalizePath(source_path);
  const destination = normalizePath(destination_path);

  if (source === destination) {
    return NextResponse.json({ error: "Source and destination can't be the same path." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { error } = await db.from("redirects").insert({
    source_path: source,
    destination_path: destination,
    redirect_type: type,
    is_active: is_active === undefined ? true : Boolean(is_active),
  });
  if (error) {
    // Postgres unique_violation on source_path
    if (error.code === "23505") {
      return NextResponse.json({ error: "A redirect for this source URL already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// Edit an existing redirect, or just flip its active status.
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, source_path, destination_path, redirect_type, is_active } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing redirect id." }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (source_path !== undefined) update.source_path = normalizePath(source_path);
  if (destination_path !== undefined) update.destination_path = normalizePath(destination_path);
  if (redirect_type !== undefined) update.redirect_type = redirect_type === 302 ? 302 : 301;
  if (is_active !== undefined) update.is_active = Boolean(is_active);

  if (update.source_path && update.destination_path && update.source_path === update.destination_path) {
    return NextResponse.json({ error: "Source and destination can't be the same path." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { error } = await db.from("redirects").update(update).eq("id", id);
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A redirect for this source URL already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const db = supabaseAdmin();
  const { error } = await db.from("redirects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
