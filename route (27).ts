import { supabase } from "@/lib/supabase";
import { PAGE_DEFS } from "@/lib/pageRegistry";
import { SITE_URL, SITE_NAME, SITE_EMAIL, absoluteUrl } from "@/lib/site";
import { stripHtml } from "@/lib/stripHtml";

// Rebuilt from the database at most once an hour, so new posts appear automatically.
export const revalidate = 3600;

const link = (title: string, path: string, note?: string) =>
  `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

export async function GET() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, content")
    .order("created_at", { ascending: false })
    .limit(50);

  const section = (group: string) =>
    PAGE_DEFS.filter((p) => p.group === group).map((p) =>
      link(p.label.replace(/^(Category|Service): /, ""), p.path, p.description)
    );

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} is a hiring platform that connects businesses with verified, skilled freelancers and experts across every industry, and helps professionals find real opportunities. Businesses contact freelancers directly, with no commissions or platform fees.`,
    "",
    "Every freelancer and business profile is reviewed by the Reflax team before it is published.",
    "",
    "## Main pages",
    ...section("Main pages"),
    "",
    "## Services",
    ...section("Services"),
    "",
    "## Freelancer categories",
    ...section("Freelancer categories"),
    "",
    "## Blog",
    ...(posts || []).map((p) =>
      link(p.title, `/blog/${p.slug}`, p.excerpt || stripHtml(p.content || "", 140))
    ),
    "",
    "## Optional",
    ...section("Legal & Contribute"),
    link("Sitemap", "/sitemap.xml"),
    "",
    `Contact: ${SITE_EMAIL} — ${SITE_URL}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
