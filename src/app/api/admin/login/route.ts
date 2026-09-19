import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password && password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    // Simple session cookie. Good enough for a single-admin internal panel.
    res.cookies.set("reflax_admin", process.env.ADMIN_PASSWORD as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  }

  return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
}
