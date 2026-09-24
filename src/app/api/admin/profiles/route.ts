import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";
import { resolveSlug } from "@/lib/slug";

const allowedFields = [
  "full_name",
  "category",
  "title",
  "bio",
  "company_name",
  "location",
  "website",
  "linkedin_url",
  "avatar_url",
  "meta_title",
  "meta_description",
  "canonical_url",
  "focus_keyword",
];

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profiles: data });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { full_name, title, bio } = body;

  if (!full_name || !title || !bio) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const db = supabaseAdmin();
  let slug: string;
  try {
    slug = await resolveSlug(db, "profiles", full_name, body.slug);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Slug error" }, { status: 400 });
  }
  const insertData: Record<string, unknown> = { slug };
  for (const key of allowedFields) {
    if (key in body) insertData[key] = body[key] || null;
  }

  const { data, error } = await db.from("profiles").insert(insertData).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, profile: data });
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const update: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in fields) update[key] = fields[key] || null;
  }

  const db = supabaseAdmin();

  if ("slug" in fields) {
    try {
      update.slug = await resolveSlug(db, "profiles", fields.full_name || "profile", fields.slug, id);
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Slug error" }, { status: 400 });
    }
  }

  const { error } = await db.from("profiles").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const db = supabaseAdmin();
  const { error } = await db.from("profiles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
