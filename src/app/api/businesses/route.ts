import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyAdminNewBusiness } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_name,
      contact_person,
      email,
      phone,
      industry,
      website,
      company_size,
      location,
      description,
    } = body;

    if (!company_name || !contact_person || !email || !industry || !description) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from("businesses")
      .insert({
        company_name,
        contact_person,
        email,
        phone: phone || null,
        industry,
        website: website || null,
        company_size: company_size || null,
        location: location || null,
        description,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    notifyAdminNewBusiness(company_name, data.id).catch((e) =>
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
