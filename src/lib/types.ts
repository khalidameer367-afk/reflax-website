export type FreelancerStatus = "pending" | "approved" | "rejected";

export interface Freelancer {
  id: string;
  created_at: string;
  user_id: string | null;
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

export interface Business {
  id: string;
  created_at: string;
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
  status: FreelancerStatus;
}

export interface EntrepreneurProfile {
  id: string;
  created_at: string;
  full_name: string;
  category: string;
  title: string;
  bio: string;
  company_name: string | null;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  featured: boolean;
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
