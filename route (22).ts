import { NextRequest, NextResponse } from "next/server";
import { notifyAdminNewFreelancer } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { full_name, category } = await req.json();
    await notifyAdminNewFreelancer(full_name || "Someone", category || "Unknown", "");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("notify-admin failed:", err);
    // Non-critical — don't fail the signup flow over this.
    return NextResponse.json({ success: false });
  }
}
