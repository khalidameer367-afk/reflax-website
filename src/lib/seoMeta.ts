import type { Metadata } from "next";
import type { SeoFields } from "@/lib/types";

export function buildMetadata(
  seo: Partial<SeoFields> | null | undefined,
  fallbackTitle: string,
  fallbackDescription?: string
): Metadata {
  const title = seo?.meta_title || fallbackTitle;
  const description = seo?.meta_description || fallbackDescription || undefined;
  const metadata: Metadata = { title, description };
  if (seo?.canonical_url) {
    metadata.alternates = { canonical: seo.canonical_url };
  }
  return metadata;
}
