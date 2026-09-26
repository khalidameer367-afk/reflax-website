import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import HeroGraphic from "@/components/HeroGraphic";
import { getPageMetadata, getPageContent } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "services",
    "Services — Reflax",
    "Recruitment, talent acquisition, and business growth consultancy services from Reflax."
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

const DEFAULT_CONTENT = `
<p>Reflax exists to make hiring simpler, but we quickly learned that hiring is rarely the only problem a growing business is dealing with. A great hire can still struggle in a business without a clear growth plan, and a great growth plan is useless without the right people to execute it. That's why, alongside our freelancer marketplace, we built three dedicated services to support businesses at every stage: Recruitment Services, Talent Acquisition, and Business Growth Consultancy.</p>

<h2>Recruitment Services — for the role you need to fill now</h2>
<p>When you have a specific opening and need it filled properly, our Recruitment Services team handles sourcing, screening, and shortlisting from Reflax's verified network of professionals — so you're only ever talking to candidates worth your time.</p>

<h2>Talent Acquisition — for the team you're building over time</h2>
<p>For businesses hiring repeatedly, not just once, Talent Acquisition brings workforce planning, pipeline building, and employer branding into one ongoing service — so you're never starting a search from scratch.</p>

<h2>Business Growth Consultancy — for the bigger picture</h2>
<p>Growth isn't just about hiring. Our consultancy team works on brand positioning, growth marketing, and operational strategy to help businesses figure out what's actually working, and what to focus on next.</p>

<h2>How these services work together</h2>
<p>Most businesses that come to Reflax for one of these services eventually use more than one — because hiring and growth are rarely separate problems. A recruitment search often surfaces a bigger workforce planning question. A growth strategy often points straight back to who needs to be hired to execute it. Rather than treating these as disconnected offerings, our team works across all three so the advice you get is consistent, whichever door you come in through.</p>

<p>Whichever service fits where your business is today, the starting point is the same: a real conversation about what you're trying to achieve, not a generic package. Explore each service below, or get in touch and we'll point you in the right direction.</p>
`;

export default async function ServicesPage() {
  const customContent = await getPageContent("services");

  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <div className="text-sm text-muted mb-5">Services</div>
            <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
              Hiring and growth support, built for real businesses.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-xl">
              Beyond our freelancer marketplace, Reflax offers three
              dedicated services to help businesses hire well and grow with
              intent — recruitment, talent acquisition, and growth
              consultancy.
            </p>
          </div>
          <div className="tilt-3d border border-line bg-ink/[0.03] min-h-[280px] md:min-h-[420px] flex items-center justify-center p-6">
            <HeroGraphic className="w-full h-full" />
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 border-b border-line bg-ink/[0.015]">
        <SectionHeading eyebrow="What we offer" title="Three ways we help businesses grow." />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => (
            <Link key={s.href} href={s.href} className="tilt-3d group block border border-line bg-paper p-8 hover:border-ink transition-all duration-300">
              <div className="text-xs font-medium text-muted mb-4">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="display text-xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.copy}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-4 group-hover:gap-2.5 transition-all">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="grid md:grid-cols-[1fr_340px] gap-12 items-start">
          <div
            className="blog-content max-w-3xl text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: customContent || DEFAULT_CONTENT }}
          />

          <aside className="md:sticky md:top-24">
            <div className="tilt-3d border border-line bg-ink p-8 md:p-9 text-paper">
              <div className="text-[11px] uppercase tracking-[0.14em] text-paper/60 mb-4">
                Connect with us
              </div>
              <h3 className="display text-2xl font-semibold leading-tight mb-5">
                Speak with a Reflax Advisor
              </h3>
              <p className="text-[15px] leading-relaxed text-paper/90 font-medium mb-3">
                Not sure which service fits your business?
              </p>
              <p className="text-[14px] leading-relaxed text-paper/65 mb-7">
                Tell us where your business is today and where you want it to go — we'll point you to the right service, or a mix of them.
              </p>
              <Link
                href="/contact"
                className="btn-pop inline-flex items-center justify-center w-full bg-paper px-6 py-3.5 text-sm font-medium text-ink hover:bg-paper/85 transition-colors mb-7"
              >
                Get in touch
              </Link>
              <div className="pt-6 border-t border-paper/15 flex flex-col gap-2.5">
                {[
                  "Free initial consultation",
                  "No obligation to commit",
                  "Guidance across all three services",
                ].map((tag) => (
                  <div key={tag} className="flex items-center gap-2.5 text-[13px] text-paper/75">
                    <span className="h-1 w-1 rounded-full bg-paper/50 shrink-0" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
