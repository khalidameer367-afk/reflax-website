import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import SectionHeading from "@/components/SectionHeading";
import { getPageMetadata } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "hire-freelancers",
    "Hire Freelancers — Reflax",
    "Browse verified freelancers by category on Reflax."
  );
}

function slugify(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const REASONS = [
  { title: "Every profile is reviewed", copy: "No anonymous accounts — our team checks each application before it goes live." },
  { title: "Direct contact, no middleman", copy: "Email or call freelancers directly. No commissions, no bidding wars, no platform fees." },
  { title: "Real specialists, not generalists", copy: "Search by category so you find someone who does exactly the work you need, not a jack-of-all-trades." },
];

export default function HireFreelancers() {
  return (
    <div>
      {/* Prominent hero with dot-grid background */}
      <section className="relative border-b border-line overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 dot-grid-bg opacity-[0.08]" style={{ filter: "invert(1)" }} />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-paper/[0.05] blur-3xl" />
        <div className="container-x py-24 md:py-32 relative">
          <div className="text-sm text-paper/50 mb-5 uppercase tracking-wide">Hire freelancers</div>
          <h1 className="display text-[2.6rem] md:text-6xl font-semibold leading-[1.05] tracking-tight text-paper max-w-3xl">
            Browse verified freelancers, ready to work.
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-paper/70 max-w-xl">
            Every profile on Reflax is personally reviewed by our team
            before it goes live. Pick a category below to see real,
            approved professionals — no bots, no spam, no guesswork.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="#categories"
              className="inline-flex items-center bg-paper text-ink px-7 py-3.5 text-sm font-medium hover:bg-paper/90 transition-colors"
            >
              Browse categories
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center border border-paper/30 px-7 py-3.5 text-sm font-medium text-paper hover:bg-paper/10 transition-colors"
            >
              Join as a freelancer
            </Link>
          </div>
        </div>
      </section>

      {/* Why hire through Reflax */}
      <section className="container-x py-16 md:py-20 border-b border-line">
        <div className="grid md:grid-cols-3 gap-10">
          {REASONS.map((r) => (
            <div key={r.title}>
              <h3 className="display text-lg font-semibold text-ink">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-x py-16 md:py-20 scroll-mt-24">
        <SectionHeading eyebrow="Categories" title="Find talent by specialty." />
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-line border border-line">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/hire-freelancers/${slugify(cat)}`}
              className="group bg-paper p-8 flex flex-col justify-between min-h-[140px] hover:bg-ink transition-colors"
            >
              <span className="text-lg font-medium text-ink group-hover:text-paper transition-colors">
                {cat}
              </span>
              <span className="text-sm text-muted group-hover:text-paper/70 transition-colors">
                View freelancers →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
