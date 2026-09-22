import { supabase } from "@/lib/supabase";
import { buildMetadata } from "@/lib/seoMeta";

export const PAGE_KEYS = [
  { key: "home", label: "Home" },
  { key: "about-us", label: "About Us" },
  { key: "hire-freelancers", label: "Hire Freelancers" },
  { key: "services", label: "Services (main page)" },
  { key: "recruitment-services", label: "Service: Recruitment Services" },
  { key: "talent-acquisition", label: "Service: Talent Acquisition" },
  { key: "business-growth-consultancy", label: "Service: Business Growth Consultancy" },
  { key: "businesses", label: "Businesses" },
  { key: "profiles", label: "Profiles" },
  { key: "blog", label: "Blog" },
  { key: "contact", label: "Contact Us" },
] as const;

export async function getPageContent(pageKey: string): Promise<string | null> {
  const { data } = await supabase.from("page_content").select("content").eq("page_key", pageKey).maybeSingle();
  return data?.content || null;
}

export async function getPageMetadata(
  pageKey: string,
  fallbackTitle: string,
  fallbackDescription?: string
) {
  const { data } = await supabase.from("page_seo").select("*").eq("page_key", pageKey).maybeSingle();
  return buildMetadata(data, fallbackTitle, fallbackDescription);
}
