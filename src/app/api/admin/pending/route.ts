import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = supabaseAdmin();

  const { data, error } = await db
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return NextResponse.json({ businesses: data });
}
