// Automatic schema.org (JSON-LD) generation for every page type on the site.
// Nothing here is stored: schema is built from the live database record every
// time the page renders, so new/edited freelancers, businesses, profiles and
// posts always get correct schema without any manual step.
import { SITE_URL, SITE_NAME, SITE_LOGO, SITE_EMAIL, SITE_SAME_AS, absoluteUrl, categorySlug } from "@/lib/site";
import { stripHtml } from "@/lib/stripHtml";
import type { PageDef } from "@/lib/pageRegistry";
import type { BlogPost, Business, EntrepreneurProfile, Freelancer, SeoFields } from "@/lib/types";

type Node = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Recursively removes undefined / null / empty strings / empty arrays / empty objects. */
function clean<T>(value: T): T {
  if (Array.isArray(value)) {
    const arr = value.map(clean).filter((v) => v !== undefined);
    return (arr.length ? arr : undefined) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const c = clean(v);
      if (c !== undefined && c !== null && c !== "") out[k] = c;
    }
    return (Object.keys(out).length ? out : undefined) as T;
  }
  return value;
}

export function graph(...nodes: (Node | Node[] | undefined | null | false)[]) {
  const flat = nodes.flat().filter(Boolean) as Node[];
  return clean({ "@context": "https://schema.org", "@graph": flat });
}

const text = (html: string | null | undefined, max = 300) => (html ? stripHtml(html, max) : undefined);
const img = (u?: string | null) => absoluteUrl(u);
const address = (loc?: string | null) => (loc ? { "@type": "PostalAddress", addressLocality: loc } : undefined);

/** The URL a page declares as canonical (admin canonical wins, else its own path). */
export function pageUrl(path: string, seo?: Partial<SeoFields> | null) {
  return absoluteUrl(seo?.canonical_url) || absoluteUrl(path)!;
}

/* ------------------------------ site-wide nodes ------------------------------ */

export function organizationNode(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: SITE_LOGO },
    email: SITE_EMAIL,
    sameAs: SITE_SAME_AS,
    description:
      "Reflax connects businesses with verified, skilled freelancers and experts across every industry — and helps professionals find real opportunities.",
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/* --------------------------------- helpers ---------------------------------- */

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(url: string, crumbs: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function itemListNode(url: string, items: { name: string; path: string }[]): Node | undefined {
  if (!items.length) return undefined;
  return {
    "@type": "ItemList",
    "@id": `${url}#list`,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

interface WebPageInput {
  url: string;
  type?: string;
  name: string;
  description?: string;
  image?: string | null;
  datePublished?: string | null;
  breadcrumbs?: Crumb[];
  mainEntityId?: string;
  hasList?: boolean;
}

function webPageNode(p: WebPageInput): Node {
  return {
    "@type": p.type || "WebPage",
    "@id": `${p.url}#webpage`,
    url: p.url,
    name: p.name,
    description: p.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    primaryImageOfPage: img(p.image) ? { "@type": "ImageObject", url: img(p.image) } : undefined,
    datePublished: p.datePublished || undefined,
    breadcrumb: p.breadcrumbs?.length ? { "@id": `${p.url}#breadcrumb` } : undefined,
    mainEntity: p.mainEntityId ? { "@id": p.mainEntityId } : p.hasList ? { "@id": `${p.url}#list` } : undefined,
  };
}

const HOME: Crumb = { name: "Home", path: "/" };

/* ----------------------------- static / listing pages ----------------------------- */

export function staticPageSchema(
  def: PageDef,
  seo: Partial<SeoFields> | null,
  parent?: PageDef,
  extra: Node[] = []
) {
  const url = pageUrl(def.path, seo);
  const name = seo?.meta_title || def.title;
  const description = seo?.meta_description || def.description;
  const crumbs: Crumb[] =
    def.path === "/"
      ? []
      : [HOME, ...(parent ? [{ name: parent.label.replace(/^Category: /, ""), path: parent.path }] : []), { name: def.label.replace(/^(Category|Service): /, ""), path: def.path }];

  const serviceNode: Node | undefined = def.service
    ? {
        "@type": "Service",
        "@id": `${url}#service`,
        name: def.label.replace(/^Service: /, ""),
        description,
        url,
        provider: { "@id": ORG_ID },
        areaServed: "Worldwide",
      }
    : undefined;

  return graph(
    webPageNode({
      url,
      type: def.schemaType,
      name,
      description,
      breadcrumbs: crumbs,
      mainEntityId: serviceNode ? `${url}#service` : undefined,
      hasList: extra.some((n) => n["@type"] === "ItemList"),
    }),
    crumbs.length ? breadcrumbNode(url, crumbs) : undefined,
    serviceNode,
    extra
  );
}

/* --------------------------------- freelancers --------------------------------- */

export const freelancerPath = (f: Pick<Freelancer, "category" | "slug" | "id">) =>
  `/hire-freelancers/${categorySlug(f.category)}/${f.slug || f.id}`;

export function freelancerSchema(f: Freelancer) {
  const path = freelancerPath(f);
  const url = pageUrl(path, f);
  const personId = `${url}#person`;
  const catPath = `/hire-freelancers/${categorySlug(f.category)}`;
  const crumbs: Crumb[] = [
    HOME,
    { name: "Hire Freelancers", path: "/hire-freelancers" },
    { name: f.category, path: catPath },
    { name: f.full_name, path },
  ];

  return graph(
    webPageNode({
      url,
      type: "ProfilePage",
      name: f.meta_title || `${f.full_name} — ${f.title}`,
      description: f.meta_description || text(f.bio, 160),
      image: f.avatar_url,
      datePublished: f.created_at,
      breadcrumbs: crumbs,
      mainEntityId: personId,
    }),
    breadcrumbNode(url, crumbs),
    {
      "@type": "Person",
      "@id": personId,
      name: f.full_name,
      jobTitle: f.title,
      description: text(f.bio),
      image: img(f.avatar_url),
      url,
      email: f.email,
      telephone: f.phone,
      address: address(f.location),
      knowsAbout: f.skills,
      hasOccupation: { "@type": "Occupation", name: f.title, occupationLocation: f.location ? { "@type": "Place", name: f.location } : undefined },
      sameAs: [f.portfolio_url, f.linkedin_url].filter(Boolean),
      memberOf: { "@id": ORG_ID },
    }
  );
}

/* ---------------------------------- businesses ---------------------------------- */

export const businessPath = (b: Pick<Business, "slug" | "id">) => `/businesses/${b.slug || b.id}`;

export function businessSchema(b: Business) {
  const path = businessPath(b);
  const url = pageUrl(path, b);
  const orgId = `${url}#organization`;
  const crumbs: Crumb[] = [HOME, { name: "Businesses", path: "/businesses" }, { name: b.company_name, path }];

  return graph(
    webPageNode({
      url,
      type: "WebPage",
      name: b.meta_title || `${b.company_name} — Reflax`,
      description: b.meta_description || text(b.description, 160),
      image: b.featured_image_url || b.logo_url,
      datePublished: b.created_at,
      breadcrumbs: crumbs,
      mainEntityId: orgId,
    }),
    breadcrumbNode(url, crumbs),
    {
      "@type": "Organization",
      "@id": orgId,
      name: b.company_name,
      description: text(b.description),
      url: b.website || url,
      logo: img(b.logo_url) ? { "@type": "ImageObject", url: img(b.logo_url) } : undefined,
      image: img(b.featured_image_url) || img(b.logo_url),
      email: b.email,
      telephone: b.phone,
      address: address(b.location),
      knowsAbout: b.industry,
      numberOfEmployees: b.company_size ? { "@type": "QuantitativeValue", value: b.company_size } : undefined,
      sameAs: b.website ? [b.website] : undefined,
      memberOf: { "@id": ORG_ID },
    }
  );
}

/* ------------------------- entrepreneur / leader profiles ------------------------- */

export const profilePath = (p: Pick<EntrepreneurProfile, "slug" | "id">) => `/profiles/${p.slug || p.id}`;

export function profileSchema(p: EntrepreneurProfile) {
  const path = profilePath(p);
  const url = pageUrl(path, p);
  const personId = `${url}#person`;
  const crumbs: Crumb[] = [HOME, { name: "Profiles", path: "/profiles" }, { name: p.full_name, path }];

  return graph(
    webPageNode({
      url,
      type: "ProfilePage",
      name: p.meta_title || `${p.full_name} — ${p.title}`,
      description: p.meta_description || text(p.bio, 160),
      image: p.avatar_url,
      datePublished: p.created_at,
      breadcrumbs: crumbs,
      mainEntityId: personId,
    }),
    breadcrumbNode(url, crumbs),
    {
      "@type": "Person",
      "@id": personId,
      name: p.full_name,
      jobTitle: p.title,
      description: text(p.bio),
      image: img(p.avatar_url),
      url,
      worksFor: p.company_name ? { "@type": "Organization", name: p.company_name, url: p.website || undefined } : undefined,
      address: address(p.location),
      knowsAbout: p.category,
      sameAs: [p.website, p.linkedin_url].filter(Boolean),
    }
  );
}

/* ------------------------------------- blog ------------------------------------- */

export const blogPath = (post: Pick<BlogPost, "slug">) => `/blog/${post.slug}`;

export function blogPostSchema(post: BlogPost) {
  const path = blogPath(post);
  const url = pageUrl(path, post);
  const articleId = `${url}#article`;
  const plain = stripHtml(post.content || "");
  const crumbs: Crumb[] = [HOME, { name: "Blog", path: "/blog" }, { name: post.title, path }];

  return graph(
    webPageNode({
      url,
      type: "WebPage",
      name: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || text(post.content, 160),
      image: post.featured_image_url,
      datePublished: post.created_at,
      breadcrumbs: crumbs,
      mainEntityId: articleId,
    }),
    breadcrumbNode(url, crumbs),
    {
      "@type": "BlogPosting",
      "@id": articleId,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      headline: (post.meta_title || post.title).slice(0, 110),
      description: post.meta_description || post.excerpt || text(post.content, 160),
      image: img(post.featured_image_url),
      datePublished: post.created_at,
      dateModified: post.created_at,
      author: post.author ? { "@type": "Person", name: post.author } : { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      keywords: post.focus_keyword,
      wordCount: plain ? plain.split(/\s+/).length : undefined,
      inLanguage: "en",
    }
  );
}
