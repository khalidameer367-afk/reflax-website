import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/types";

const SITE_URL = "https://reflax.org";

function slugify(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: freelancers }, { data: businesses }, { data: profiles }, { data: posts }] = await Promise.all([
    supabase.from("freelancers").select("slug, id, category, created_at").eq("status", "approved"),
    supabase.from("businesses").select("slug, id, created_at").eq("status", "approved"),
    supabase.from("profiles").select("slug, id, created_at"),
    supabase.from("blog_posts").select("slug, created_at"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hire-freelancers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/recruitment-services`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services/talent-acquisition`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services/business-growth-consultancy`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/businesses`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/profiles`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/register`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/hire-freelancers/${slugify(c)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const freelancerPages: MetadataRoute.Sitemap = (freelancers || []).map((f) => ({
    url: `${SITE_URL}/hire-freelancers/${slugify(f.category)}/${f.slug || f.id}`,
    lastModified: f.created_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const businessPages: MetadataRoute.Sitemap = (businesses || []).map((b) => ({
    url: `${SITE_URL}/businesses/${b.slug || b.id}`,
    lastModified: b.created_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const profilePages: MetadataRoute.Sitemap = (profiles || []).map((p) => ({
    url: `${SITE_URL}/profiles/${p.slug || p.id}`,
    lastModified: p.created_at,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.created_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...freelancerPages, ...businessPages, ...profilePages, ...blogPages];
}
