import { NextRequest, NextResponse } from "next/server";
import { notifyContactForm } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }
    await notifyContactForm(name, email, subject || "", message);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
