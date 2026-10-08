import { NextRequest, NextResponse } from "next/server";
import { notifyGuestPost } from "@/lib/mailer";
import { CONTRIBUTOR_NICHES } from "@/lib/types";
import { cleanText, isEmail } from "@/lib/publicInput";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel's request limit is 4.5 MB)
const ALLOWED_EXT = ["doc", "docx", "pdf", "txt", "rtf", "odt"];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    // Hidden "trap" field: real visitors never fill it, spam bots do.
    if (cleanText(form.get("website"))) {
      return NextResponse.json({ success: true });
    }

    const name = cleanText(form.get("name"), 100);
    const email = cleanText(form.get("email"), 150);
    const nicheValue = cleanText(form.get("niche"), 50);
    const file = form.get("file");

    const niche = CONTRIBUTOR_NICHES.find((n) => n.value === nicheValue);
    if (!name || !isEmail(email) || !niche) {
      return NextResponse.json({ error: "Please fill your name, a valid email and choose a niche." }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Please attach your article file." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "The file is too large. Please keep it under 4 MB." }, { status: 400 });
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ error: "Please upload a .doc, .docx, .pdf, .txt, .rtf or .odt file." }, { status: 400 });
    }

    const content = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120);
    await notifyGuestPost(name, email, niche.label, { filename: safeName, content });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("write-for-us failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
