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
  ctaHeading,
  ctaBody,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  content: string;
  faqs: { question: string; answer: string }[];
  image?: { src: string; alt: string };
  highlights?: string[];
  ctaHeading?: string;
  ctaBody?: string;
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
        <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start">
          <div
            className="blog-content max-w-3xl text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <aside className="md:sticky md:top-24">
            <div className="tilt-3d border border-line bg-ink/[0.03] p-8">
              <div className="text-xs font-medium text-muted mb-3">Get started</div>
              <h3 className="display text-xl font-semibold text-ink mb-3 leading-snug">
                {ctaHeading ?? `Want our ${title}?`}
              </h3>
              <p className="text-[14px] leading-relaxed text-muted mb-6">
                {ctaBody ?? "Reach out and we'll walk you through how it works for your business."}
              </p>
              <Link
                href="/contact"
                className="btn-pop inline-flex items-center justify-center w-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 border-b border-line">
        <div className="tilt-3d border border-line p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="display text-2xl font-semibold text-ink max-w-md">
            Ready to get started?
          </h2>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/hire-freelancers"
              className="btn-pop inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
            >
              Hire a freelancer
            </Link>
            <Link
              href="/register"
              className="btn-pop inline-flex items-center border border-ink px-7 py-3.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
            >
              Join as a freelancer
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
    </div>
  );
}
