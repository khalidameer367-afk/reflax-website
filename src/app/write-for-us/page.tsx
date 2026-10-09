import Image from "next/image";
import { getPageMetadata } from "@/lib/pageSeo";
import PageSchema from "@/components/PageSchema";
import WriteForUsForm from "@/components/WriteForUsForm";

export const revalidate = 60;

export async function generateMetadata() {
  return getPageMetadata(
    "write-for-us",
    "Write for Us | Become a Contributor — Reflax",
    "Write for Reflax: contribute guest posts on technology, education, business, AI and digital marketing to a growing, business-focused audience."
  );
}

const ELIGIBILITY = [
  "A LinkedIn profile or website that shows your professional background.",
  "Willingness to share the guest post on your own channels. If you are not proud to share your work, it should not be contributed.",
  "Real industry experience or qualifications that make you credible on the topic.",
];

const BASICS = [
  "Relevant, well-researched posts (preferably 1000+ words) with practical, actionable tips.",
  "100% original and unpublished. We do not republish anything that has already been published elsewhere.",
  "Only includes claims that are backed by links to credible research or case studies. Avoid citing our competitors, and using any irrelevant promotional links to websites.",
  "Includes examples and relevant images to illustrate your point. Avoid using stock photos that don't add any value to the copy.",
  "Includes subheadings, bullet points, and shorter paragraphs which make the article more readable.",
  "We reserve the right to republish them on LinkedIn or any other channel.",
];

const TOPICS = [
  {
    name: "Technology",
    desc: "AI tools, gadgets, software reviews and tech trends that help readers choose and use technology better.",
  },
  {
    name: "Education",
    desc: "Learning tips, online courses and teaching strategies for students, teachers and lifelong learners.",
  },
  {
    name: "Business",
    desc: "Entrepreneurship, marketing and productivity advice for founders, teams and growing companies.",
  },
  {
    name: "AI",
    desc: "AI applications, tool reviews and industry trends explained in a practical, real-world way.",
  },
  {
    name: "Digital Marketing",
    desc: "SEO, GEO, Google Ads, SMO and SMM: tactics, case studies and strategies that drive measurable results.",
  },
  {
    name: "General",
    desc: "Other relevant topics from your own field of expertise, as long as the article is based on real-world experience.",
  },
];

const BENEFITS = [
  "Exposure to a business-focused audience. Reflax connects companies with verified freelancers and experts, so your article reaches people who are actively looking for knowledge and talent.",
  "A high-authority, dofollow backlink that strengthens your own site. Since the link is placed naturally within a relevant, well-written article rather than a paid placement, it carries far more SEO weight than a typical directory listing.",
  "Association with a trusted, recognized brand. Your work appears alongside the expertise Reflax is building, which helps you grow your reputation in your niche.",
  "Networking and future opportunities. Getting published positions you as a known, credible contributor, opening the door to future collaborations.",
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
            <h1 className="display text-[2.2rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
              Write for Us | Become a Contributor
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted max-w-xl">
              We welcome contributions from established professionals from
              various fields. If you are a professional who wants Reflax to
              feature your expertise in a capacity you are comfortable with, this
              is the place for you. This doesn&apos;t mean you have to be famous,
              but you should be able to show that you are an expert in your field
              and have credentials to prove it.
            </p>
            <a
              href="#pitch-form"
              className="btn-pop mt-8 inline-flex items-center border border-accent bg-accent px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink hover:text-paper transition-colors hover:border-ink"
            >
              Submit your article
            </a>
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

      {/* Eligibility */}
      <section className="container-x py-10 md:py-12 border-b border-line">
        <div className="max-w-3xl">
          <h2 className="display text-2xl font-semibold text-ink">Who Can Contribute</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            At a minimum, you should have:
          </p>
          <ul className="mt-5 space-y-3">
            {ELIGIBILITY.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The Basics */}
      <section className="container-x py-10 md:py-12 border-b border-line bg-ink/[0.015]">
        <div className="max-w-3xl">
          <h2 className="display text-2xl font-semibold text-ink">The Basics</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Every guest post we publish should be:
          </p>
          <ul className="mt-5 space-y-3">
            {BASICS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Topics We Cover */}
      <section className="container-x py-10 md:py-12 border-b border-line">
        <div className="max-w-3xl">
          <h2 className="display text-2xl font-semibold text-ink">Topics We Cover</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Most of our audience consists of business owners, professionals and
            learners. We are looking for guest posts that help them work smarter,
            so we accept clear, compelling content that falls into the following
            categories.
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((t) => (
            <div key={t.name} className="tilt-3d border border-line bg-paper p-6">
              <h3 className="display text-lg font-semibold text-ink">
                Write for Us {t.name}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Benefits */}
      <section className="container-x py-10 md:py-12 border-b border-line bg-ink/[0.015]">
        <div className="max-w-3xl">
          <h2 className="display text-2xl font-semibold text-ink">The Benefits</h2>
          <ul className="mt-5 space-y-4">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] leading-relaxed text-ink font-medium">
            Due to the high volume of guest post requests we receive, submissions
            are manually reviewed by our team. If your content aligns with our
            requirements and is relevant to our audience, we will review it and
            contact you.
          </p>
        </div>
      </section>

      {/* Form */}
      <section id="pitch-form" className="container-x py-10 md:py-14 scroll-mt-24">
        <h2 className="display text-2xl font-semibold text-ink">Ready to contribute?</h2>
        <p className="mt-3 mb-8 text-[15px] leading-relaxed text-muted max-w-2xl">
          Fill the form below and get things started.
        </p>
        <WriteForUsForm />
      </section>
    </div>
  );
}
