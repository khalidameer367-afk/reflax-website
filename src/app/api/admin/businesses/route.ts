import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";
import { resolveSlug } from "@/lib/slug";
import { notifyBusinessApproved } from "@/lib/mailer";

const allowedFields = [
  "company_name",
  "contact_person",
  "email",
  "phone",
  "industry",
  "website",
  "company_size",
  "location",
  "description",
  "logo_url",
  "featured_image_url",
  "verified",
  "featured",
  "meta_title",
  "meta_description",
  "canonical_url",
  "focus_keyword",
];

const BOOLEAN_FIELDS = new Set(["verified", "featured"]);

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { company_name, contact_person, email, industry, description } = body;
  if (!company_name || !contact_person || !email || !industry || !description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const db = supabaseAdmin();
  let slug: string;
  try {
    slug = await resolveSlug(db, "businesses", company_name, body.slug);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Slug error" }, { status: 400 });
  }
  const insertData: Record<string, unknown> = { slug, status: "approved" };
  for (const key of allowedFields) {
    if (key in body) {
      insertData[key] = BOOLEAN_FIELDS.has(key) ? Boolean(body[key]) : body[key] || null;
    }
  }

  const { data, error } = await db.from("businesses").insert(insertData).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  notifyBusinessApproved(email, company_name).catch(() => {});

  return NextResponse.json({ success: true, business: data });
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
    if (key in fields) {
      update[key] = BOOLEAN_FIELDS.has(key) ? Boolean(fields[key]) : fields[key] || null;
    }
  }

  const db = supabaseAdmin();

  if ("slug" in fields) {
    try {
      update.slug = await resolveSlug(db, "businesses", fields.company_name || "business", fields.slug, id);
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Slug error" }, { status: 400 });
    }
  }

  const { error } = await db.from("businesses").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const db = supabaseAdmin();
  const { error } = await db.from("businesses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
