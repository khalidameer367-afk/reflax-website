import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "robots_txt")
    .maybeSingle();

  const content =
    data?.value ||
    `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api

Sitemap: https://reflax.org/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
