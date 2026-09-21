import SectionHeading from "@/components/SectionHeading";
import HeroGraphic from "@/components/HeroGraphic";
import AbstractPanel from "@/components/AbstractPanel";
import { getPageMetadata } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "about-us",
    "About Us — Reflax",
    "Reflax is a strategic partner in talent, branding, and business growth."
  );
}

const PILLARS = [
  {
    title: "Our Mission",
    copy: "To connect businesses with the right experts through a simple, reliable, and efficient platform. We make hiring easier by helping companies find verified professionals who truly fit their needs and can support their growth.",
  },
  {
    title: "Our Vision",
    copy: "To become a leading global platform where businesses and professionals connect seamlessly to create meaningful opportunities and sustainable growth — a trusted ecosystem that transforms how companies hire, market their services, and develop their teams.",
  },
  {
    title: "Our Goal",
    copy: "To simplify expert hiring and business growth by providing a reliable, efficient, and results-driven platform — helping companies quickly find the right professionals, build strong teams, and enhance their online presence.",
  },
];

const VALUES = [
  { title: "Verified, always", copy: "Every freelancer, business, and entrepreneur profile is personally reviewed before it goes live — no bots, no fake listings." },
  { title: "No hidden fees", copy: "Reflax doesn't take a cut of your work. Connect and negotiate directly, the way hiring should work." },
  { title: "Built for growth", copy: "We're not just a directory — from recruitment to brand strategy, we support businesses at every stage." },
  { title: "Fast reviews", copy: "New applications are typically reviewed within 48 hours, so you're never left waiting to get started." },
];

export default function AboutUs() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <div className="text-sm text-muted mb-5">About us</div>
            <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
              Your strategic partner in talent, branding, and business growth.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-lg">
              Reflax started with a simple observation: hiring shouldn't
              mean sorting through hundreds of unverified profiles, and
              growing a business shouldn't require ten different tools and
              agencies. So we built one place that does both — properly.
            </p>
          </div>
          <div className="border border-line aspect-square hidden md:flex items-center justify-center p-6">
            <HeroGraphic className="w-full h-full" />
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-24 border-b border-line">
        <div className="grid md:grid-cols-3 gap-10">
          {PILLARS.map((p) => (
            <div key={p.title}>
              <h3 className="display text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20 md:py-24 border-b border-line">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="order-2 md:order-1 border border-line p-6">
            <AbstractPanel className="w-full h-auto" />
          </div>
          <div className="order-1 md:order-2">
            <SectionHeading
              eyebrow="Beyond hiring"
              title="We go beyond being just another hiring platform."
              description="At Reflax, we believe in creating real opportunities for businesses and professionals. We become your growth partner — supporting your journey from the first hire to long-term expansion."
            />
            <p className="mt-4 text-[15px] leading-relaxed text-muted max-w-lg">
              Beyond connecting talent with opportunity, our team offers
              recruitment support, talent acquisition strategy, and
              business growth consultancy — because a great hire is only
              the start of the story.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-24">
        <SectionHeading eyebrow="What we stand for" title="The principles behind Reflax." />
        <div className="mt-12 grid sm:grid-cols-2 gap-px bg-line border border-line">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-paper p-8">
              <h3 className="display text-base font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
