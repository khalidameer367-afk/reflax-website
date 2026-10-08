import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateUniqueSlug } from "@/lib/slug";
import { notifyAdminNewBusiness, notifyAdminNewProfile } from "@/lib/mailer";
import { cleanText, cleanUrl, cleanImageDataUrl, plainToHtml, isEmail } from "@/lib/publicInput";

// Public "Join Us" forms: professional profile and business.
// Everything is saved as "pending" and only goes live after the admin approves it.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Hidden "trap" field for spam bots.
    if (cleanText(body.website_confirm)) return NextResponse.json({ success: true });

    const db = supabaseAdmin();

    if (body.type === "professional") {
      const full_name = cleanText(body.full_name, 100);
      const title = cleanText(body.title, 150);
      const bio = cleanText(body.bio, 6000);
      const email = cleanText(body.email, 150);
      if (!full_name || !title || !bio || !isEmail(email)) {
        return NextResponse.json({ error: "Please fill your name, title, a valid email and your bio." }, { status: 400 });
      }
      const slug = await generateUniqueSlug(db, "profiles", full_name);
      const { data, error } = await db
        .from("profiles")
        .insert({
          slug,
          full_name,
          title,
          bio: plainToHtml(bio),
          category: cleanText(body.category, 100) || null,
          company_name: cleanText(body.company_name, 150) || null,
          location: cleanText(body.location, 150) || null,
          website: cleanUrl(body.website) || null,
          linkedin_url: cleanUrl(body.linkedin_url) || null,
          avatar_url: cleanImageDataUrl(body.avatar_url),
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;
      try {
        await notifyAdminNewProfile(full_name, title, email, cleanText(body.phone, 40));
      } catch (e) {
        console.error("Profile notification failed:", e);
      }
      return NextResponse.json({ success: true, id: data?.id });
    }

    if (body.type === "business") {
      const company_name = cleanText(body.company_name, 150);
      const contact_person = cleanText(body.contact_person, 100);
      const email = cleanText(body.email, 150);
      const industry = cleanText(body.industry, 120);
      const description = cleanText(body.description, 6000);
      if (!company_name || !contact_person || !industry || !description || !isEmail(email)) {
        return NextResponse.json(
          { error: "Please fill company name, contact person, a valid email, industry and description." },
          { status: 400 }
        );
      }
      const slug = await generateUniqueSlug(db, "businesses", company_name);
      const { data, error } = await db
        .from("businesses")
        .insert({
          slug,
          company_name,
          contact_person,
          email,
          phone: cleanText(body.phone, 40) || null,
          industry,
          company_size: cleanText(body.company_size, 60) || null,
          website: cleanUrl(body.website) || null,
          location: cleanText(body.location, 150) || null,
          description: plainToHtml(description),
          logo_url: cleanImageDataUrl(body.logo_url),
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;
      try {
        await notifyAdminNewBusiness(company_name, data?.id || "");
      } catch (e) {
        console.error("Business notification failed:", e);
      }
      return NextResponse.json({ success: true, id: data?.id });
    }

    return NextResponse.json({ error: "Invalid form type." }, { status: 400 });
  } catch (err) {
    console.error("join failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
