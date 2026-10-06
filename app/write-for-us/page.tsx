import Image from "next/image";
import Link from "next/link";
import { getPageMetadata } from "@/lib/pageSeo";
import PageSchema from "@/components/PageSchema";
import WriteForUsForm from "@/components/WriteForUsForm";

export const revalidate = 60;

export async function generateMetadata() {
  return getPageMetadata(
    "write-for-us",
    "Write for Us | Become a Contributor — Reflax",
    "Write for Reflax: guest post guidelines and topics we cover — Technology, Education, Business, AI and Digital Marketing."
  );
}

const REQUIREMENTS = [
  "A minimum of a LinkedIn profile or website where we can verify your expertise.",
  "Willingness to share the guest post on your own channels, such as your LinkedIn or website.",
  "Relevant experience or qualifications in the topic you want to write about.",
];

const BASICS = [
  "Is relevant, well-researched and 100% original and unpublished. We do not republish content from other websites.",
  "Only includes claims that are backed by credible research or real examples. Avoid citing our competitors.",
  "Is practical and actionable, with clear tips, steps and takeaways readers can use right away.",
  "Includes examples, and images or screenshots that add value. Avoid stock photos that don't help explain the topic.",
  "Includes subheadings, bullet points and short paragraphs that make the article easy to scan.",
  "We reserve the right to republish content on LinkedIn or any other channel.",
];

const TOPICS = [
  {
    name: "Technology",
    text: "AI tools, gadgets, software reviews and tech trends that help people and teams work smarter.",
  },
  {
    name: "Education",
    text: "Learning tips, online courses and teaching strategies for students, teachers and self-learners.",
  },
  {
    name: "Business",
    text: "Entrepreneurship, marketing and productivity — practical guidance for founders and growing teams.",
  },
  {
    name: "AI",
    text: "AI applications, tool reviews and industry trends, from everyday use cases to emerging technology.",
  },
  {
    name: "Digital Marketing",
    text: "SEO, GEO, Google Ads, SMO and SMM — strategies and case studies that drive measurable growth.",
  },
];

const BENEFITS = [
  "Exposure to a professional, business-focused audience that reads Reflax every month.",
  "A high-authority, do-follow backlink to your website or profile from a growing, relevant platform.",
  "Association with a trusted brand that connects businesses with verified experts and freelancers worldwide.",
  "Networking and future opportunities. Getting published with us builds credibility and can open doors to collaborations.",
];

function Row({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-line scroll-mt-24">
      <div className="container-x py-10 md:py-12 grid md:grid-cols-[240px_1fr] gap-4 md:gap-14">
        <h2 className="display text-xl font-semibold text-ink md:sticky md:top-28 h-fit">
          {title}
        </h2>
        <div className="max-w-3xl">{children}</div>
      </div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
          <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function WriteForUs() {
  return (
    <div>
      <PageSchema pageKey="write-for-us" />

      <section className="border-b border-line">
        <div className="container-x py-14 md:py-20 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
              Write for Us | Become a Contributor
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-xl">
              We also welcome contributions from established professionals from
              various fields. If you&apos;re a professional who uses Reflax in
              some capacity, you&apos;re welcome to send in your contribution.
              Not Reflax users are also welcome to contribute as long as they
              fit the requirements.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted max-w-xl">
              This doesn&apos;t mean you have to be famous. But you should be
              able to show that you&apos;re an expert in your field and have
              credentials to prove it.
            </p>
            <Link
              href="#pitch-form"
              className="btn-pop mt-8 inline-flex items-center border border-accent bg-accent px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink hover:border-ink transition-colors"
            >
              Pitch your article
            </Link>
          </div>
          <div className="tilt-3d relative border border-line min-h-[260px] md:min-h-[380px] overflow-hidden">
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

      <Row title="Requirements">
        <p className="text-[15px] leading-relaxed text-muted mb-5">
          At a minimum you should have:
        </p>
        <Bullets items={REQUIREMENTS} />
      </Row>

      <Row title="The Basics">
        <p className="text-[15px] leading-relaxed text-muted mb-5">
          Your article should be:
        </p>
        <Bullets items={BASICS} />
      </Row>

      <Row title="Topics We Cover">
        <p className="text-[15px] leading-relaxed text-muted mb-6">
          Most of our audience consists of individuals and teams, from different
          organizations and departments, who are looking for tips, best
          practices and guides on how to work and collaborate better. Pick the
          topic closest to your expertise:
        </p>
        <ul className="border-t border-line">
          {TOPICS.map((t) => (
            <li key={t.name} className="border-b border-line py-5 grid sm:grid-cols-[210px_1fr] gap-1 sm:gap-8">
              <span className="text-[15px] font-semibold text-ink">
                Write for Us {t.name}
              </span>
              <span className="text-[15px] leading-relaxed text-muted">{t.text}</span>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="The Benefits">
        <Bullets items={BENEFITS} />
        <p className="mt-6 text-[15px] leading-relaxed text-muted">
          Due to the high volume of guest post requests we receive, submissions
          are managed by editorial review. If your content aligns with
          Reflax&apos;s requirements and is relevant to our audience, we will
          reach out to you.
        </p>
      </Row>

      <Row id="pitch-form" title="Submit your pitch">
        <p className="text-[15px] leading-relaxed text-muted mb-8">
          Fill the form below and get things started.
        </p>
        <WriteForUsForm />
      </Row>
    </div>
  );
}
