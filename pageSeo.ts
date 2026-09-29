import { cache } from "react";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { getPageDef } from "@/lib/pageRegistry";
import type { PageSeo, SeoFields } from "@/lib/types";

// Re-exported so existing imports keep working.
export { PAGE_KEYS } from "@/lib/pageRegistry";

export async function getPageContent(pageKey: string): Promise<string | null> {
  const { data } = await supabase.from("page_content").select("content").eq("page_key", pageKey).maybeSingle();
  return data?.content || null;
}

// cache() = one DB read per request even though metadata + schema both need it.
export const getPageSeo = cache(async (pageKey: string): Promise<PageSeo | null> => {
  const { data } = await supabase.from("page_seo").select("*").eq("page_key", pageKey).maybeSingle();
  return (data as PageSeo | null) ?? null;
});

export async function getPageMetadata(
  pageKey: string,
  fallbackTitle: string,
  fallbackDescription?: string
) {
  const seo = await getPageSeo(pageKey);
  const def = getPageDef(pageKey);
  return buildMetadata(seo, fallbackTitle, fallbackDescription, { path: def?.path });
}

export interface MetaOptions {
  /** The page's real path, e.g. "/hire-freelancers/seo/john-doe". Used as the default canonical. */
  path?: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
}

/**
 * Admin-controlled SEO → Next.js metadata.
 *  - meta title / description: admin value, else the fallback.
 *  - canonical: admin value if set, else the page's own URL (self-referencing).
 *  - Open Graph + Twitter tags are filled automatically from the same values.
 */
export function buildMetadata(
  seo: Partial<SeoFields> | null | undefined,
  fallbackTitle: string,
  fallbackDescription?: string,
  opts: MetaOptions = {}
): Metadata {
  const title = seo?.meta_title || fallbackTitle;
  const description = seo?.meta_description || fallbackDescription || undefined;
  const canonical = absoluteUrl(seo?.canonical_url) || absoluteUrl(opts.path);
  const image = absoluteUrl(opts.image);

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: opts.type === "article" ? "article" : opts.type === "profile" ? "profile" : "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
  if (canonical) metadata.alternates = { canonical };
  if (opts.noindex) metadata.robots = { index: false, follow: false };
  return metadata;
}
