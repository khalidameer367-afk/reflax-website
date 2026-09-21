import { supabase } from "@/lib/supabase";
import { buildMetadata } from "@/lib/seoMeta";

export const PAGE_KEYS = [
  { key: "home", label: "Home" },
  { key: "about-us", label: "About Us" },
  { key: "hire-freelancers", label: "Hire Freelancers" },
  { key: "businesses", label: "Businesses" },
  { key: "profiles", label: "Profiles" },
  { key: "blog", label: "Blog" },
  { key: "contact", label: "Contact Us" },
] as const;

export async function getPageMetadata(
  pageKey: string,
  fallbackTitle: string,
  fallbackDescription?: string
) {
  const { data } = await supabase.from("page_seo").select("*").eq("page_key", pageKey).maybeSingle();
  return buildMetadata(data, fallbackTitle, fallbackDescription);
}
