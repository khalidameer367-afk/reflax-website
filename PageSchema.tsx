import { getPageDef } from "@/lib/pageRegistry";
import { getPageSeo } from "@/lib/pageSeo";
import { staticPageSchema, itemListNode, pageUrl } from "@/lib/schema";

/**
 * Renders a JSON-LD <script>. "<" is escaped so content (bios, titles…) can never
 * close the script tag early.
 */
export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Drop <PageSchema pageKey="about-us" /> into any static/listing page and the
 * correct schema (WebPage/AboutPage/ContactPage/CollectionPage + breadcrumbs
 * [+ Service, + item list]) is generated automatically. It uses the same admin
 * meta title/description/canonical the page's <head> uses, so both always agree.
 */
export default async function PageSchema({
  pageKey,
  items,
}: {
  pageKey: string;
  /** Optional list of things shown on the page (freelancers, businesses…) → ItemList. */
  items?: { name: string; path: string }[];
}) {
  const def = getPageDef(pageKey);
  if (!def) return null;
  const seo = await getPageSeo(pageKey);
  const parent = def.parent ? getPageDef(def.parent) : undefined;
  const list = items ? itemListNode(pageUrl(def.path, seo), items) : undefined;
  return <JsonLd data={staticPageSchema(def, seo, parent, list ? [list] : [])} />;
}
