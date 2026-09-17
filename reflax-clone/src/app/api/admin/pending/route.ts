import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = supabaseAdmin();

  const [freelancers, businesses] = await Promise.all([
    db.from("freelancers").select("*").order("created_at", { ascending: false }),
    db.from("businesses").select("*").order("created_at", { ascending: false }),
  ]);

  if (freelancers.error) throw freelancers.error;
  if (businesses.error) throw businesses.error;

  return NextResponse.json({
    freelancers: freelancers.data,
    businesses: businesses.data,
  });
}
