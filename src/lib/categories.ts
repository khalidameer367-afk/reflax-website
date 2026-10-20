// Single source of truth for freelancer categories.
// - name:       what visitors, forms and the admin panel show (and what is saved for new freelancers)
// - slug:       the URL, e.g. /hire-freelancers/video-editors
// - legacy:     the OLD name (older records may still use it until the SQL migration is run)
// - oldSlugs:   old URLs that now redirect (301) to the new slug
// - metaTitle / metaDescription: default SEO text (can still be overridden in Admin -> Pages)
// This file has no imports so it can be used from both server and client code.

export interface CategoryConfig {
  name: string;
  slug: string;
  legacy: string;
  oldSlugs: string[];
  metaTitle: string;
  metaDescription: string;
}

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    name: "SEO Experts",
    slug: "seo-experts",
    legacy: "SEO",
    oldSlugs: ["seo"],
    metaTitle: "Hire Expert SEO Freelancers Online | Reflax",
    metaDescription:
      "Hire experienced SEO freelancers on Reflax to improve search rankings, grow organic traffic, and boost your online visibility. Find the right SEO expert today.",
  },
  {
    name: "WordPress Developers",
    slug: "wordpress-developers",
    legacy: "WordPress Development",
    oldSlugs: ["wordpress-development"],
    metaTitle: "Hire WordPress Developers Online | Reflax",
    metaDescription:
      "Hire skilled WordPress developers on Reflax to build, customize, and optimize your website. Connect with experienced professionals for your web development needs.",
  },
  {
    name: "Google Ads Experts",
    slug: "google-ads",
    legacy: "Google Ads (PPC)",
    oldSlugs: ["google-ads-ppc-"],
    metaTitle: "Hire Google Ads Experts Online | Reflax",
    metaDescription:
      "Hire experienced Google Ads experts on Reflax to optimize ad campaigns, increase conversions, and maximize your advertising ROI. Find the right expert today.",
  },
  {
    name: "Social Media Marketers",
    slug: "social-media-marketers",
    legacy: "Social Media Marketing",
    oldSlugs: ["social-media-marketing"],
    metaTitle: "Hire Experts Social Media Marketers | Reflax",
    metaDescription:
      "Hire skilled social media marketers on Reflax to grow your audience, boost engagement, manage social media accounts, and promote your brand online.",
  },
  {
    name: "Content Writers",
    slug: "content-writers",
    legacy: "Content Writing",
    oldSlugs: ["content-writing"],
    metaTitle: "Hire Experts Content Writers Online | Reflax",
    metaDescription:
      "Hire skilled content writers on Reflax to create engaging blog posts, website content, SEO articles, and marketing copy that connects with your audience.",
  },
  {
    name: "Graphic Designers",
    slug: "graphic-designers",
    legacy: "Graphic Design",
    oldSlugs: ["graphic-design"],
    metaTitle: "Hire Experts Graphic Designers Online | Reflax",
    metaDescription:
      "Hire talented graphic designers on Reflax to create stunning logos, branding, social media graphics, marketing materials, and more for your business.",
  },
  {
    name: "Video Editors",
    slug: "video-editors",
    legacy: "Video Editing",
    oldSlugs: ["video-editing"],
    metaTitle: "Hire Experts Video Editors Online | Reflax",
    metaDescription:
      "Hire skilled video editors on Reflax to create engaging videos for social media, YouTube, marketing, and business. Find the right video editing expert today.",
  },
  {
    name: "Web Developers",
    slug: "web-developers",
    legacy: "Web Development",
    oldSlugs: ["web-development"],
    metaTitle: "Hire Web Developers Online | Reflax",
    metaDescription:
      "Hire skilled web developers on Reflax to build fast, secure and scalable websites and web apps. Connect with experienced professionals today.",
  },
  {
    name: "App Developers",
    slug: "app-developers",
    legacy: "App Development",
    oldSlugs: ["app-development"],
    metaTitle: "Hire App Developers Online | Reflax",
    metaDescription:
      "Hire experienced app developers on Reflax to build reliable iOS, Android and cross-platform apps. Find the right developer today.",
  },
  {
    name: "Virtual Assistants",
    slug: "virtual-assistants",
    legacy: "Virtual Assistance",
    oldSlugs: ["virtual-assistance"],
    metaTitle: "Hire Virtual Assistants Online | Reflax",
    metaDescription:
      "Hire reliable virtual assistants on Reflax to handle admin, scheduling, research and daily operations so you can focus on growing your business.",
  },
  {
    name: "Accounting & Finance Experts",
    slug: "accounting-finance-experts",
    legacy: "Accounting & Finance",
    oldSlugs: ["accounting-finance"],
    metaTitle: "Hire Accounting & Finance Experts Online | Reflax",
    metaDescription:
      "Hire experienced accountants and finance experts on Reflax for bookkeeping, reporting, tax support and financial planning.",
  },
  {
    name: "Sales & Business Development Experts",
    slug: "sales-business-development-experts",
    legacy: "Sales & Business Development",
    oldSlugs: ["sales-business-development"],
    metaTitle: "Hire Sales & Business Development Experts | Reflax",
    metaDescription:
      "Hire experienced sales and business development experts on Reflax to generate leads, close deals and grow your revenue.",
  },
];

const generic = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Finds a category by its current name OR its legacy (old) name. */
export function findCategory(nameOrLegacy: string | null | undefined): CategoryConfig | undefined {
  if (!nameOrLegacy) return undefined;
  return CATEGORY_CONFIG.find((c) => c.name === nameOrLegacy || c.legacy === nameOrLegacy);
}

export function findCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORY_CONFIG.find((c) => c.slug === slug);
}

/** URL slug for a category (works with both new and old category names). */
export function categorySlugFor(nameOrLegacy: string): string {
  return findCategory(nameOrLegacy)?.slug ?? generic(nameOrLegacy);
}
