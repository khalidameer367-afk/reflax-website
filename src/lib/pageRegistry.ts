// Pure data (safe to import from client components such as the admin panel).
// Every static page on the site is listed here ONCE. Adding a page here makes
// it (a) editable in Admin -> Pages (meta title/description/canonical) and
// (b) get automatic JSON-LD schema.
import { CATEGORIES } from "@/lib/types";
import { categorySlug } from "@/lib/site";

export type PageSchemaType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

export interface PageDef {
  key: string;
  label: string;
  group: "Main pages" | "Services" | "Legal & Contribute" | "Freelancer categories";
  path: string;
  title: string; // default <title> / schema name
  description: string;
  schemaType: PageSchemaType;
  parent?: string; // key of parent page, used for breadcrumbs
  service?: boolean; // adds a Service node
}

const CORE: PageDef[] = [
  { key: "home", label: "Home", group: "Main pages", path: "/", title: "Reflax — Hiring Platform for Experts & Freelancers", description: "Reflax connects businesses with verified, skilled freelancers and experts across every industry.", schemaType: "WebPage" },
  { key: "about-us", label: "About Us", group: "Main pages", path: "/about-us", title: "About Us — Reflax", description: "Reflax is a strategic partner in talent, branding, and business growth.", schemaType: "AboutPage" },
  { key: "hire-freelancers", label: "Hire Freelancers", group: "Main pages", path: "/hire-freelancers", title: "Hire Freelancers — Reflax", description: "Browse verified freelancers by category on Reflax.", schemaType: "CollectionPage" },
  { key: "businesses", label: "Businesses", group: "Main pages", path: "/businesses", title: "Businesses — Reflax", description: "A directory of businesses building with Reflax.", schemaType: "CollectionPage" },
  { key: "profiles", label: "Profiles", group: "Main pages", path: "/profiles", title: "Profiles — Reflax", description: "A directory of entrepreneurs and business leaders on Reflax.", schemaType: "CollectionPage" },
  { key: "blog", label: "Blog", group: "Main pages", path: "/blog", title: "Blog — Reflax", description: "Insights on hiring, growth, and building teams.", schemaType: "CollectionPage" },
  { key: "contributor", label: "Contributors", group: "Main pages", path: "/contributor", title: "Contributor Posts — Reflax", description: "Guest posts from industry experts on technology, education, business, AI and digital marketing.", schemaType: "CollectionPage" },
  { key: "contact", label: "Contact Us", group: "Main pages", path: "/contact", title: "Contact Us — Reflax", description: "Questions about hiring or registering your business? Send us a message.", schemaType: "ContactPage" },

  { key: "services", label: "Services (main page)", group: "Services", path: "/services", title: "Services — Reflax", description: "Recruitment, talent acquisition, and business growth consultancy services from Reflax.", schemaType: "CollectionPage" },
  { key: "recruitment-services", label: "Service: Recruitment Services", group: "Services", path: "/services/recruitment-services", title: "Recruitment Services — Reflax", description: "End-to-end recruitment support from Reflax — sourcing, screening, shortlisting, and onboarding help for growing businesses.", schemaType: "WebPage", parent: "services", service: true },
  { key: "talent-acquisition", label: "Service: Talent Acquisition", group: "Services", path: "/services/talent-acquisition", title: "Talent Acquisition — Reflax", description: "Long-term talent acquisition strategy from Reflax — workforce planning, pipeline building, and employer branding for growing teams.", schemaType: "WebPage", parent: "services", service: true },
  { key: "business-growth-consultancy", label: "Service: Business Growth Consultancy", group: "Services", path: "/services/business-growth-consultancy", title: "Business Growth Consultancy — Reflax", description: "Practical brand, marketing, and operations consultancy from Reflax to help your business grow with intent, not guesswork.", schemaType: "WebPage", parent: "services", service: true },

  { key: "write-for-us", label: "Write for Us", group: "Legal & Contribute", path: "/write-for-us", title: "Write for Reflax — Contribute Content", description: "Contribute articles to Reflax and reach a growing, business-focused audience.", schemaType: "WebPage" },
  { key: "privacy-policy", label: "Privacy Policy", group: "Legal & Contribute", path: "/privacy-policy", title: "Privacy Policy — Reflax", description: "How Reflax collects, uses, and protects your information.", schemaType: "WebPage" },
  { key: "terms-and-conditions", label: "Terms & Conditions", group: "Legal & Contribute", path: "/terms-and-conditions", title: "Terms & Conditions — Reflax", description: "The terms that govern your use of the Reflax platform.", schemaType: "WebPage" },
];

/** page_seo key used for a freelancer category listing page, e.g. "hire-freelancers/seo". */
export const categoryPageKey = (slug: string) => `hire-freelancers/${slug}`;

export function categoryDefaults(cat: string) {
  return {
    title: `${cat} Freelancers — Reflax`,
    description: `Hire verified ${cat} freelancers on Reflax. Browse profiles, compare skills and experience, and contact experts directly.`,
  };
}

const CATEGORY_PAGES: PageDef[] = CATEGORIES.map((cat) => {
  const slug = categorySlug(cat);
  return {
    key: categoryPageKey(slug),
    label: `Category: ${cat}`,
    group: "Freelancer categories" as const,
    path: `/hire-freelancers/${slug}`,
    ...categoryDefaults(cat),
    schemaType: "CollectionPage" as const,
    parent: "hire-freelancers",
  };
});

export const PAGE_DEFS: PageDef[] = [...CORE, ...CATEGORY_PAGES];

/** Backwards-compatible shape used by the admin panel. */
export const PAGE_KEYS = PAGE_DEFS.map(({ key, label, group, path }) => ({ key, label, group, path }));

export function getPageDef(key: string): PageDef | undefined {
  return PAGE_DEFS.find((p) => p.key === key);
}
