import Link from "next/link";

export default function ServicePage({
  eyebrow,
  title,
  intro,
  points,
  ctaHref,
  ctaLabel,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  points: { title: string; copy: string }[];
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <div className="text-sm text-muted mb-5">{eyebrow}</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            {title}
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-xl">{intro}</p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 border-b border-line">
        <div className="grid md:grid-cols-3 gap-10">
          {points.map((p) => (
            <div key={p.title}>
              <h3 className="display text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="border border-line p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="display text-2xl font-semibold text-ink max-w-md">
            Ready to get started?
          </h2>
          <Link
            href={ctaHref}
            className="shrink-0 inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
