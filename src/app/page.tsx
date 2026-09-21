import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Marquee from "@/components/Marquee";
import HeroGraphic from "@/components/HeroGraphic";
import { CATEGORIES } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { getPageMetadata } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "home",
    "Reflax — Hiring Platform for Experts & Freelancers",
    "Reflax connects businesses with verified, skilled freelancers and experts across every industry."
  );
}

const SERVICES = [
  {
    title: "Recruitment Services",
    href: "/services/recruitment-services",
    copy: "End-to-end hiring support — from sourcing to shortlisting — so you fill roles with people who actually fit.",
  },
  {
    title: "Talent Acquisition",
    href: "/services/talent-acquisition",
    copy: "Long-term hiring strategy for building teams that scale with your business, not just fill a seat.",
  },
  {
    title: "Business Growth Consultancy",
    href: "/services/business-growth-consultancy",
    copy: "Practical guidance on branding, marketing and operations to help your business grow with intent.",
  },
];

const STATS = [
  { value: "500+", label: "Verified professionals" },
  { value: "120+", label: "Businesses hired through us" },
  { value: "12", label: "Industry categories" },
  { value: "48h", label: "Average review time" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Browse or post", copy: "Explore verified freelancers by category, or register your own profile in minutes." },
  { step: "02", title: "We review it", copy: "Every profile and listing is checked by our team before it goes live — no fake accounts, no spam." },
  { step: "03", title: "Connect directly", copy: "Reach out by email or phone, no middleman, no extra fees taken from either side." },
];

export default async function Home() {
  const [{ data: businesses }, { data: profiles }] = await Promise.all([
    supabase.from("businesses").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(8),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(8),
  ]);

  const businessItems = (businesses || []).map((b) => ({
    id: b.id,
    href: `/businesses/${b.slug || b.id}`,
    name: b.company_name,
    image: b.logo_url,
    sub: b.industry,
  }));

  const profileItems = (profiles || []).map((p) => ({
    id: p.id,
    href: `/profiles/${p.slug || p.id}`,
    name: p.full_name,
    image: p.avatar_url,
    sub: p.title,
  }));

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <div className="text-sm text-muted mb-5">
              A hiring platform for experts &amp; freelancers
            </div>
            <h1 className="display text-[2.6rem] md:text-6xl font-semibold leading-[1.05] tracking-tight text-ink">
              Find and hire the right person, without the guesswork.
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-muted max-w-xl">
              Reflax connects businesses with verified, skilled freelancers
              and experts across every industry — and helps professionals
              build strong profiles that get them hired. Every listing on
              Reflax is personally reviewed before it goes live, so you're
              never guessing who you're really talking to.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/hire-freelancers"
                className="inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
              >
                Hire a freelancer
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center border border-ink px-7 py-3.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Join as a professional
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-4 gap-6 max-w-md">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="display text-xl md:text-2xl font-semibold text-ink">{s.value}</div>
                  <div className="mt-1 text-xs text-muted leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-line p-8 hidden md:flex items-center justify-center aspect-square">
            <HeroGraphic className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* Businesses & Profiles marquee */}
      <section className="py-14 border-b border-line bg-ink/[0.015]">
        <div className="container-x mb-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-muted">Businesses on Reflax</span>
        </div>
        <Marquee items={businessItems.length > 0 ? businessItems : DUMMY_BUSINESSES} />
        <div className="container-x mt-10 mb-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-muted">Featured profiles</span>
        </div>
        <Marquee items={profileItems.length > 0 ? profileItems : DUMMY_PROFILES} />
      </section>

      {/* Mission */}
      <section className="container-x py-20 md:py-24 border-b border-line">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <SectionHeading
            eyebrow="Why Reflax"
            title="We remove the complexity from hiring."
          />
          <div className="text-[15px] leading-relaxed text-muted space-y-4">
            <p>
              Whether you're a startup, a small business, or an established
              enterprise, Reflax makes it simple to discover, compare, and
              hire the right experts for your needs. Every listing is curated
              for quality, credibility, and transparency — so your hiring
              decisions are always informed and secure.
            </p>
            <p>
              We built Reflax because hiring shouldn't mean scrolling
              through hundreds of unverified profiles, or businesses
              disappearing after a first message. Every freelancer,
              business and entrepreneur profile here is reviewed by a real
              person on our team — so what you see is what you get.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-20 md:py-24 border-b border-line">
        <SectionHeading eyebrow="How it works" title="Simple, transparent, and fast." />
        <div className="mt-12 grid md:grid-cols-3 gap-10">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="fade-in-up">
              <div className="display text-4xl font-semibold text-ink/15 mb-3">{s.step}</div>
              <h3 className="display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-20 md:py-24 border-b border-line">
        <SectionHeading
          eyebrow="Browse talent"
          title="Freelancers across every category you need."
          description="From SEO and web development to marketing and design — explore verified professionals by specialty."
        />
        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-line border border-line">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/hire-freelancers/${encodeURIComponent(
                cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")
              )}`}
              className="group bg-paper p-7 flex items-center justify-between hover:bg-ink transition-colors"
            >
              <span className="text-[15px] font-medium text-ink group-hover:text-paper transition-colors">
                {cat}
              </span>
              <span className="text-muted group-hover:text-paper transition-colors">→</span>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/hire-freelancers" className="text-sm font-medium underline underline-offset-4">
            View all freelancers
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="container-x py-20 md:py-24 border-b border-line">
        <SectionHeading eyebrow="What we offer" title="Services built for growing businesses." />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {SERVICES.map((s) => (
            <Link key={s.href} href={s.href} className="group block border border-line p-8 hover:border-ink hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
              <h3 className="display text-xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.copy}</p>
              <span className="mt-6 inline-block text-sm font-medium text-ink underline underline-offset-4">
                Learn more
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Businesses CTA */}
      <section className="container-x py-20 md:py-24 border-b border-line">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHeading
              eyebrow="For companies"
              title="A directory of businesses across every industry."
              description="Browse companies that are already part of the Reflax network, or get in touch if you'd like your business featured in our directory."
            />
            <Link
              href="/businesses"
              className="mt-8 inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
            >
              Browse businesses
            </Link>
          </div>
          <div className="border border-line p-10">
            <p className="display text-2xl leading-snug text-ink">
              &ldquo;At Reflax, we go beyond being just another hiring
              platform — we become your growth partner.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Profiles CTA */}
      <section className="container-x py-20 md:py-24">
        <div className="border border-line p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="display text-2xl md:text-3xl font-semibold text-ink max-w-md">
              Explore entrepreneur profiles across every category.
            </h2>
            <p className="mt-3 text-sm text-muted max-w-sm">
              A curated directory of standout entrepreneurs and business
              leaders, organized by industry.
            </p>
          </div>
          <Link
            href="/profiles"
            className="shrink-0 inline-flex items-center border border-ink px-7 py-3.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            View profiles
          </Link>
        </div>
      </section>
    </div>
  );
}

// Fallback placeholder items so the marquee never looks empty before you've
// added real businesses/profiles — remove once you have enough real ones.
const DUMMY_BUSINESSES = [
  { id: "d1", href: "/businesses", name: "Your business here", image: null, sub: "Get listed" },
];
const DUMMY_PROFILES = [
  { id: "d2", href: "/profiles", name: "Your profile here", image: null, sub: "Get featured" },
];
