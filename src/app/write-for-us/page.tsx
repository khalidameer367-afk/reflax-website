import Link from "next/link";
import HeroGraphic from "@/components/HeroGraphic";
import { getPageMetadata } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "write-for-us",
    "Write for Reflax — Contribute Content",
    "Contribute articles to Reflax and reach a growing, business-focused audience."
  );
}

const WHO = [
  "Business growth & startups",
  "Talent acquisition & hiring",
  "Branding & digital marketing",
  "Freelancing & career development",
  "Automation & productivity",
];

const EXPECT = [
  "Original and plagiarism-free",
  "Clear, practical, and reader-focused",
  "Helpful for businesses or professionals",
  "Well-structured and easy to understand",
];

const WHY = [
  "Reach a professional business audience",
  "Build your personal or brand authority",
  "Get credited for your work",
  "Share expertise in your niche",
];

export default function WriteForUs() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <div className="text-sm text-muted mb-5">Contribute</div>
            <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
              Write for Reflax.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-xl">
              At Reflax, we welcome passionate writers, industry experts, and
              creators who want to share valuable insights with a growing
              business-focused audience. By contributing to our platform, you
              can demonstrate your expertise, build authority for your brand,
              and reach a broader audience that values relevant and
              insightful content.
            </p>
          </div>
          <div className="tilt-3d border border-line bg-ink/[0.03] min-h-[280px] md:min-h-[420px] flex items-center justify-center p-6">
            <HeroGraphic className="w-full h-full" />
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 border-b border-line">
        <div className="grid md:grid-cols-2 gap-14 max-w-4xl">
          <div>
            <h2 className="display text-xl font-semibold text-ink">Who can contribute?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We accept contributions from professionals in:
            </p>
            <ul className="mt-5 space-y-3">
              {WHO.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="display text-xl font-semibold text-ink">What we expect</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              All submissions should be:
            </p>
            <ul className="mt-5 space-y-3">
              {EXPECT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 border-b border-line bg-ink/[0.015]">
        <h2 className="display text-xl font-semibold text-ink">Why write for Reflax?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted max-w-xl">
          Publishing with us helps you:
        </p>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {WHY.map((item, i) => (
            <div key={item} className="tilt-3d border border-line bg-paper p-6">
              <div className="text-xs font-medium text-muted mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-[15px] leading-relaxed text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="tilt-3d border border-line p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="display text-2xl font-semibold text-ink">Join us</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Become a part of Reflax and contribute to a platform that
              connects talent, branding, and business growth experts
              worldwide.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn-pop inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors shrink-0"
          >
            Pitch your article
          </Link>
        </div>
      </section>
    </div>
  );
}
