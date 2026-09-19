import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { CATEGORIES } from "@/lib/types";

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

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-[1.2fr_1fr] gap-12 items-end">
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
              build strong profiles that get them hired.
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
          </div>

          <div className="border border-line p-8">
            <div className="grid grid-cols-2 gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="display text-3xl font-semibold text-ink">{s.value}</div>
                  <div className="mt-1 text-sm text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container-x py-20 md:py-24 border-b border-line">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <SectionHeading
            eyebrow="Why Reflax"
            title="We remove the complexity from hiring."
          />
          <p className="text-[15px] leading-relaxed text-muted">
            Whether you're a startup, a small business, or an established
            enterprise, Reflax makes it simple to discover, compare, and
            hire the right experts for your needs. Every listing is curated
            for quality, credibility, and transparency — so your hiring
            decisions are always informed and secure.
          </p>
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
            <Link key={s.href} href={s.href} className="group block border border-line p-8 hover:border-ink transition-colors">
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
              title="Register your business and get discovered."
              description="Add your company to Reflax's directory of businesses across industries — visible to freelancers and partners looking to work with you."
            />
            <Link
              href="/businesses"
              className="mt-8 inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
            >
              Register your business
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
