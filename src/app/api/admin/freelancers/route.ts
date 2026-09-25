import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";
import { resolveSlug } from "@/lib/slug";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("freelancers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ freelancers: data });
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Only allow known columns to be updated.
  const allowed = [
    "full_name",
    "email",
    "phone",
    "category",
    "title",
    "bio",
    "skills",
    "experience_years",
    "hourly_rate",
    "location",
    "portfolio_url",
    "linkedin_url",
    "avatar_url",
    "meta_title",
    "meta_description",
    "canonical_url",
    "focus_keyword",
  ];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in fields) {
      if (key === "skills" && typeof fields[key] === "string") {
        update[key] = fields[key]
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      } else if (key === "experience_years") {
        update[key] = fields[key] ? Number(fields[key]) : null;
      } else {
        update[key] = fields[key] || null;
      }
    }
  }

  const db = supabaseAdmin();

  if ("slug" in fields) {
    try {
      const nameForFallback = fields.full_name || "profile";
      update.slug = await resolveSlug(db, "freelancers", nameForFallback, fields.slug, id);
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Slug error" }, { status: 400 });
    }
  }

  const { error } = await db.from("freelancers").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const db = supabaseAdmin();
  const { error } = await db.from("freelancers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
