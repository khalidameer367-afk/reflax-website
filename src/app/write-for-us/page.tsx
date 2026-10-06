import Link from "next/link";
import Image from "next/image";
import { getPageMetadata } from "@/lib/pageSeo";
import PageSchema from "@/components/PageSchema";

export const revalidate = 60;

export async function generateMetadata() {
  return getPageMetadata(
    "write-for-us",
    "Write for Us — Technology, AI, Business, Education & Digital Marketing | Reflax",
    "Write for Reflax: submit guest posts on technology, AI, education, business and digital marketing (SEO, GEO, Google Ads, SMO, SMM) and reach a growing professional audience."
  );
}

const TOPICS = [
  {
    title: "Write for Us Technology",
    text: "AI tools, gadgets, software reviews and the tech trends shaping how people work.",
    tags: ["AI tools", "Gadgets", "Software reviews", "Tech trends"],
    icon: (
      <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7zM10 10h4v4h-4z" />
    ),
  },
  {
    title: "Write for Us Education",
    text: "Learning tips, online courses and teaching strategies that help people grow faster.",
    tags: ["Learning tips", "Online courses", "Teaching strategies"],
    icon: <path d="M2 9l10-5 10 5-10 5L2 9zM6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />,
  },
  {
    title: "Write for Us Business",
    text: "Entrepreneurship, marketing and productivity ideas that real businesses can use.",
    tags: ["Entrepreneurship", "Marketing", "Productivity"],
    icon: <path d="M3 8h18v12H3zM9 8V5h6v3M3 13h18" />,
  },
  {
    title: "Write for Us AI",
    text: "AI applications, tool reviews and industry trends explained in a practical way.",
    tags: ["AI applications", "Tool reviews", "Industry trends"],
    icon: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />,
  },
  {
    title: "Write for Us Digital Marketing",
    text: "SEO, GEO, Google Ads, SMO and SMM — strategies, case studies and how-tos that work.",
    tags: ["SEO", "GEO", "Google Ads", "SMO", "SMM"],
    icon: <path d="M3 11v3a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1zM15 9a4 4 0 010 6M18 6.5a8 8 0 010 11" />,
  },
];

const EXPECT = [
  "Original, plagiarism-free and not published elsewhere",
  "Clear, practical and written for readers first",
  "Between 800 and 2,000 words with headings and short paragraphs",
  "Backed by real examples, data or first-hand experience",
  "Free of AI-generated filler, spammy links and over-promotion",
];

const WHY = [
  "Reach a professional, business-focused audience",
  "Build your personal or brand authority",
  "Get full author credit with a bio",
  "Share your expertise in your niche",
];

const STEPS = [
  { title: "Pick a topic", text: "Choose one of the five categories above that fits your expertise." },
  { title: "Send your pitch", text: "Share your title, a short outline and a link to your previous writing." },
  { title: "Get approval", text: "Our team reviews your idea and replies with feedback or a go-ahead." },
  { title: "Publish", text: "Submit the final article and we publish it with your author credit." },
];

export default function WriteForUs() {
  return (
    <div>
      <PageSchema pageKey="write-for-us" />

      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-x py-14 md:py-20 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <div className="text-sm text-muted mb-5">Contribute</div>
            <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
              Write for Us.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-xl">
              At Reflax, we welcome passionate writers, industry experts and
              creators who want to share valuable insights on technology, AI,
              education, business and digital marketing. Publish with us to
              show your expertise, build authority for your brand and reach an
              audience that values useful, well-researched content.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-pop inline-flex items-center border border-accent bg-accent px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink hover:border-ink transition-colors"
              >
                Pitch your article
              </Link>
              <a
                href="#topics"
                className="btn-pop inline-flex items-center border border-ink bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-accent hover:border-accent transition-colors"
              >
                See topics we cover
              </a>
            </div>
          </div>
          <div className="tilt-3d relative border border-line min-h-[280px] md:min-h-[420px] overflow-hidden">
            <Image
              src="/images/write-for-us-hero.jpg"
              alt="Writer taking notes in a notebook at a desk with a laptop, representing contributing articles to Reflax"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="container-x py-12 md:py-16 border-b border-line scroll-mt-24">
        <div className="max-w-2xl">
          <div className="text-sm text-muted mb-3">Topics we cover</div>
          <h2 className="display text-3xl md:text-[2.4rem] font-semibold leading-[1.1] tracking-tight text-ink">
            What can you write about?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            We accept guest posts in these five categories. Pick the one where
            you can add real value for our readers.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((t, i) => (
            <article key={t.title} className="tilt-3d border border-line bg-paper p-7 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center border border-line text-accent">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {t.icon}
                  </svg>
                </span>
                <span className="text-xs font-medium text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="display mt-6 text-lg font-semibold text-ink">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <li key={tag} className="border border-line px-2.5 py-1 text-xs text-ink">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <div className="tilt-3d border border-ink bg-ink p-7 flex flex-col justify-between text-paper">
            <div>
              <h3 className="display text-lg font-semibold">Have a different idea?</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/70">
                If your topic fits our audience, pitch it anyway — we read every
                submission.
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex w-fit items-center border border-paper/40 px-5 py-2.5 text-sm font-medium hover:bg-paper hover:text-ink transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Guidelines + Why */}
      <section className="container-x py-12 md:py-16 border-b border-line">
        <div className="grid md:grid-cols-2 gap-14">
          <div>
            <h2 className="display text-xl font-semibold text-ink">Writing guidelines</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              All submissions should be:
            </p>
            <ul className="mt-5 space-y-3">
              {EXPECT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-xl font-semibold text-ink">Why write for Reflax?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Publishing with us helps you:
            </p>
            <ul className="mt-5 space-y-3">
              {WHY.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-x py-12 md:py-16 border-b border-line bg-ink/[0.015]">
        <h2 className="display text-xl font-semibold text-ink">How it works</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted max-w-xl">
          From pitch to publication in four simple steps.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="tilt-3d border border-line bg-paper p-6">
              <div className="text-xs font-medium text-accent mb-3">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="display text-base font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-10 md:py-12">
        <div className="tilt-3d border border-line p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="display text-2xl font-semibold text-ink">Ready to contribute?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Become a part of Reflax and share your expertise with a global
              audience of professionals, founders and learners.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn-pop inline-flex items-center border border-accent bg-accent px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink hover:text-paper transition-colors shrink-0 hover:border-ink"
          >
            Pitch your article
          </Link>
        </div>
      </section>
    </div>
  );
}
