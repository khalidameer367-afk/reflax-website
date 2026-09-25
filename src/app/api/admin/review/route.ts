import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";
import {
  notifyFreelancerApproved,
  notifyBusinessApproved,
} from "@/lib/mailer";

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, id, action } = await req.json();
  // type: "freelancer" | "business"
  // action: "approved" | "rejected"

  if (!["freelancer", "business"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!["approved", "rejected"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const table = type === "freelancer" ? "freelancers" : "businesses";

  const { data, error } = await db
    .from(table)
    .update({ status: action })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  if (action === "approved") {
    try {
      if (type === "freelancer") {
        await notifyFreelancerApproved(data.email, data.full_name);
      } else {
        await notifyBusinessApproved(data.email, data.company_name);
      }
    } catch (e) {
      console.error("Failed to send approval email:", e);
    }
  }

  return NextResponse.json({ success: true });
}
