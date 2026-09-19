import { NextRequest } from "next/server";

export function isAdminAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get("reflax_admin")?.value;
  return Boolean(cookie) && cookie === process.env.ADMIN_PASSWORD;
}
