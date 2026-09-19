import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyAdminNewFreelancer } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      phone,
      category,
      title,
      bio,
      skills,
      experience_years,
      hourly_rate,
      location,
      portfolio_url,
      linkedin_url,
      avatar_url,
    } = body;

    if (!full_name || !email || !category || !title || !bio) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from("freelancers")
      .insert({
        full_name,
        email,
        phone: phone || null,
        category,
        title,
        bio,
        skills: Array.isArray(skills)
          ? skills
          : String(skills || "")
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean),
        experience_years: experience_years ? Number(experience_years) : null,
        hourly_rate: hourly_rate || null,
        location: location || null,
        portfolio_url: portfolio_url || null,
        linkedin_url: linkedin_url || null,
        avatar_url: avatar_url || null,
        // Profiles go live immediately — no approval step. The admin can
        // still edit or remove any profile from /admin.
        status: "approved",
      })
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget — don't block the response if email fails.
    // This just notifies the admin a new profile went live; it's informational.
    notifyAdminNewFreelancer(full_name, category, data.id).catch((e) =>
      console.error("Failed to send admin notification email:", e)
    );

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
