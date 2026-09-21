import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";
import { generateUniqueSlug } from "@/lib/slug";

const allowedFields = [
  "title",
  "excerpt",
  "content",
  "featured_image_url",
  "author",
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
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { title, content } = body;
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const slug = await generateUniqueSlug(db, "blog_posts", title);
  const insertData: Record<string, unknown> = { slug };
  for (const key of allowedFields) {
    if (key in body) insertData[key] = body[key] || null;
  }

  const { data, error } = await db.from("blog_posts").insert(insertData).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, post: data });
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
  const { error } = await db.from("blog_posts").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const db = supabaseAdmin();
  const { error } = await db.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
