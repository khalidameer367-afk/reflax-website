import Link from "next/link";
import FaqSection from "@/components/FaqSection";
import AbstractPanel from "@/components/AbstractPanel";

export default function ServicePage({
  eyebrow,
  title,
  intro,
  content,
  faqs,
  image,
  highlights,
  ctaEyebrow,
  ctaHeading,
  ctaQuestion,
  ctaBody,
  ctaTags,
  finalCtaEyebrow,
  finalCtaHeading,
  finalCtaBody,
  finalCtaTags,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  content: string;
  faqs: { question: string; answer: string }[];
  image?: { src: string; alt: string };
  highlights?: string[];
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaQuestion?: string;
  ctaBody?: string;
  ctaTags?: string[];
  finalCtaEyebrow?: string;
  finalCtaHeading?: string;
  finalCtaBody?: string;
  finalCtaTags?: string[];
}) {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <div className="text-sm text-muted mb-5">{eyebrow}</div>
            <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-xl">{intro}</p>
          </div>
          <div className="tilt-3d relative border border-line bg-ink/[0.03] min-h-[280px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
            {/* Always-visible fallback graphic, so this box is never empty even if a photo fails to load */}
            <div className="absolute inset-0 p-6 flex items-center justify-center">
              <AbstractPanel className="w-full h-auto opacity-70" />
            </div>
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {highlights && highlights.length > 0 && (
        <section className="border-b border-line bg-ink/[0.015]">
          <div className="container-x py-14 md:py-16 grid sm:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <div key={h} className="tilt-3d border border-line bg-paper p-6">
                <div className="text-xs font-medium text-muted mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-[15px] leading-relaxed text-ink">{h}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-x py-16 md:py-20 border-b border-line">
        <div className="grid md:grid-cols-[1fr_340px] gap-12 items-start">
          <div
            className="blog-content max-w-3xl text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <aside className="md:sticky md:top-24">
            <div className="tilt-3d border border-line bg-ink p-8 md:p-9 text-paper">
              <div className="text-[11px] uppercase tracking-[0.14em] text-paper/60 mb-4">
                {ctaEyebrow ?? "Connect with us"}
              </div>
              <h3 className="display text-2xl font-semibold leading-tight mb-5">
                {ctaHeading ?? `Speak with a Reflax Advisor`}
              </h3>
              <p className="text-[15px] leading-relaxed text-paper/90 font-medium mb-3">
                {ctaQuestion ?? `Considering ${title} for your business?`}
              </p>
              <p className="text-[14px] leading-relaxed text-paper/65 mb-7">
                {ctaBody ??
                  "Receive practical guidance tailored to your business, your team, and where you're headed."}
              </p>
              <Link
                href="/contact"
                className="btn-pop inline-flex items-center justify-center w-full bg-paper px-6 py-3.5 text-sm font-medium text-ink hover:bg-paper/85 transition-colors mb-7"
              >
                Get in touch
              </Link>
              <div className="pt-6 border-t border-paper/15 flex flex-col gap-2.5">
                {(ctaTags ?? ["Free initial consultation", "No obligation", "Confidential & tailored advice"]).map(
                  (tag) => (
                    <div key={tag} className="flex items-center gap-2.5 text-[13px] text-paper/75">
                      <span className="h-1 w-1 rounded-full bg-paper/50 shrink-0" />
                      {tag}
                    </div>
                  )
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 border-b border-line">
        <div className="tilt-3d border border-line bg-ink p-10 md:p-16 text-paper">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-paper/60 mb-4">
                {finalCtaEyebrow ?? "Ready to get started?"}
              </div>
              <h2 className="display text-3xl md:text-4xl font-semibold leading-tight mb-5 max-w-lg">
                {finalCtaHeading ?? `Let's talk about your ${title}`}
              </h2>
              <p className="text-[15px] leading-relaxed text-paper/70 max-w-md mb-9">
                {finalCtaBody ?? intro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-pop inline-flex items-center bg-paper px-7 py-3.5 text-sm font-medium text-ink hover:bg-paper/85 transition-colors"
                >
                  Get in touch
                </Link>
                <Link
                  href="/hire-freelancers"
                  className="btn-pop inline-flex items-center border border-paper/40 px-7 py-3.5 text-sm font-medium text-paper hover:bg-paper hover:text-ink transition-colors"
                >
                  Hire a freelancer
                </Link>
                <Link
                  href="/register"
                  className="btn-pop inline-flex items-center border border-paper/40 px-7 py-3.5 text-sm font-medium text-paper hover:bg-paper hover:text-ink transition-colors"
                >
                  Join as a freelancer
                </Link>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-paper/15 pt-8 md:pt-1 md:pl-12 flex flex-col gap-6">
              {(finalCtaTags ?? [
                "No commitment required to start the conversation",
                "We reply within one business day",
                "Speak directly with our team, not a bot",
              ]).map((tag) => (
                <div key={tag} className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-paper/50 mt-2 shrink-0" />
                  <p className="text-[14px] leading-relaxed text-paper/75">{tag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
    </div>
  );
}
