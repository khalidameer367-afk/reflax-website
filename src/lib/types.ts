export type FreelancerStatus = "pending" | "approved" | "rejected";

export interface SeoFields {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  focus_keyword: string | null;
}

export interface Freelancer extends SeoFields {
  id: string;
  created_at: string;
  user_id: string | null;
  slug: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  category: string;
  title: string;
  bio: string;
  skills: string[];
  experience_years: number | null;
  hourly_rate: string | null;
  location: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  status: FreelancerStatus;
}

export interface Business extends SeoFields {
  id: string;
  created_at: string;
  slug: string | null;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  industry: string;
  website: string | null;
  company_size: string | null;
  location: string | null;
  description: string;
  logo_url: string | null;
  featured_image_url: string | null;
  status: FreelancerStatus;
}

export interface EntrepreneurProfile extends SeoFields {
  id: string;
  created_at: string;
  slug: string | null;
  full_name: string;
  category: string | null;
  title: string;
  bio: string;
  company_name: string | null;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  featured: boolean;
}

export interface BlogPost extends SeoFields {
  id: string;
  created_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  author: string | null;
}

export interface PageSeo extends SeoFields {
  id: string;
  page_key: string;
}

export interface PageContentRow {
  id: string;
  page_key: string;
  content: string | null;
}

export interface Redirect {
  id: string;
  created_at: string;
  source_path: string;
  destination_path: string;
}

export const CATEGORIES = [
  "SEO",
  "WordPress Development",
  "Google Ads (PPC)",
  "Social Media Marketing",
  "Content Writing",
  "Graphic Design",
  "Video Editing",
  "Web Development",
  "App Development",
  "Virtual Assistance",
  "Accounting & Finance",
  "Sales & Business Development",
] as const;

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "SEO": "Search engine optimization experts help your website rank higher on Google, driving organic traffic that converts. From technical audits and keyword research to link building and content strategy, a skilled SEO specialist builds the foundation for long-term, sustainable growth — without paying for every visitor.",
  "WordPress Development": "WordPress powers a huge share of the web, and doing it well takes real skill — custom themes, fast load times, clean plugin architecture, and rock-solid security. Our WordPress developers build sites that are easy to manage and built to last.",
  "Google Ads (PPC)": "Paid search is one of the fastest ways to get in front of ready-to-buy customers. A good Google Ads specialist doesn't just launch campaigns — they continuously test, optimize bids, and cut wasted spend so every rupee works harder.",
  "Social Media Marketing": "From content calendars to paid social campaigns, social media marketers help brands build an audience and turn followers into customers. Find specialists across Instagram, Facebook, LinkedIn, TikTok, and more.",
  "Content Writing": "Clear, persuasive writing sells — whether it's website copy, blog articles, email campaigns, or product descriptions. Our content writers help your brand say the right thing, to the right audience, at the right time.",
  "Graphic Design": "First impressions matter. From logos and brand identity to social creatives and packaging, skilled designers translate your brand into something people remember.",
  "Video Editing": "Video is the format that gets attention. Whether it's short-form social content, YouTube, or promotional videos, our editors bring raw footage to life with pacing, sound, and story that keeps people watching.",
  "Web Development": "A fast, reliable, well-built website is the backbone of any modern business. Our web developers work across modern frameworks to build sites and apps that perform.",
  "App Development": "From idea to app store, our mobile and app developers build reliable, well-designed products for iOS, Android, and the web.",
  "Virtual Assistance": "Free up your time by delegating the operational work — scheduling, inbox management, research, data entry, and more — to a reliable virtual assistant.",
  "Accounting & Finance": "Keep your books clean and your finances under control with experienced bookkeepers, accountants, and financial analysts.",
  "Sales & Business Development": "Grow your pipeline with experienced sales professionals who know how to prospect, pitch, negotiate, and close.",
};
