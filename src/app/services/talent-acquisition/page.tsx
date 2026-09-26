import ServicePage from "@/components/ServicePage";
import { getPageMetadata, getPageContent } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "talent-acquisition",
    "Talent Acquisition — Reflax",
    "Long-term talent acquisition strategy from Reflax — workforce planning, pipeline building, and employer branding for growing teams."
  );
}

const DEFAULT_CONTENT = `
<h2>Building a team that scales with you, not just filling a seat</h2>
<p>There's a real difference between recruitment and talent acquisition. Recruitment solves today's open role. Talent acquisition solves the question you'll be asking again in six months, and again after that — who does this business need next, and how do we make sure we're not scrambling to find them at the last minute? Reflax's Talent Acquisition service is built for businesses that are past their first few hires and are now thinking about how their team should grow over the next year, not just the next month.</p>

<h2>Our approach to talent acquisition</h2>
<p>We work as an extension of your team, not a one-off vendor. That starts with understanding where your business is headed, not just where it is today.</p>
<h3>1. Workforce planning</h3>
<p>We map out the roles and skills your business is likely to need as it grows — based on your product roadmap, your revenue targets, or whatever's actually driving the next phase of the business — so hiring decisions are made ahead of time, not in a panic.</p>
<h3>2. Building a talent pipeline</h3>
<p>Rather than starting a search from zero every time a role opens, we build and maintain a pipeline of pre-vetted candidates who fit your business, so when a role does open up, you're choosing from people you already know are qualified.</p>
<h3>3. Employer branding</h3>
<p>Skilled professionals have options. We help position your business as a place people actually want to work — through how roles are presented, how candidates are treated during the process, and how your company shows up across Reflax and beyond.</p>
<h3>4. Ongoing strategy reviews</h3>
<p>Hiring needs change as a business grows. We check in regularly to revisit the plan, adjust the pipeline, and make sure your talent strategy is still matching where the business is actually going.</p>

<h2>Who this is for</h2>
<p>Talent acquisition makes the most sense for businesses that are hiring repeatedly — not just once — and want a consistent, repeatable process instead of reinventing the wheel every time. If you're building out a department, opening a new market, or simply growing fast enough that hiring has become a regular part of running the business, this is the service built for that stage.</p>

<h2>The Reflax difference</h2>
<p>Because talent acquisition through Reflax draws on the same verified network used across our platform, you're never starting a pipeline from scratch. Every candidate in your pipeline has already been reviewed, so the process moves faster and with more confidence than building a talent strategy completely from the outside in.</p>
`;

const FAQS = [
  {
    question: "What's the difference between Talent Acquisition and Recruitment Services?",
    answer: "Recruitment Services solve a specific open role right now. Talent Acquisition is a longer-term strategy — workforce planning, pipeline building, and employer branding — for businesses hiring repeatedly over time.",
  },
  {
    question: "How long is a typical Talent Acquisition engagement?",
    answer: "Most engagements run on a quarterly or ongoing basis, since the value comes from consistent pipeline building rather than a single search.",
  },
  {
    question: "Do you work with businesses that don't have an internal HR team?",
    answer: "Yes — in fact that's exactly who this service is designed for. We can operate as your de facto talent acquisition function until you're ready to build one internally.",
  },
  {
    question: "Can this service help with hiring for a completely new department?",
    answer: "Yes. Workforce planning for a new department or function is one of the most common reasons businesses come to us for talent acquisition support.",
  },
  {
    question: "What is employer branding, practically speaking?",
    answer: "It's how your business is perceived by potential hires — the clarity of your job listings, how candidates are treated during the process, and your visible presence on platforms like Reflax. We help improve all of it.",
  },
  {
    question: "Do you help with compensation and offer strategy?",
    answer: "We can advise on competitive positioning based on what we're seeing across the market, though final compensation decisions remain with your business.",
  },
  {
    question: "How is pricing structured for this service?",
    answer: "Talent Acquisition is typically priced as an ongoing engagement rather than a per-hire fee — reach out via our contact page and we'll scope it to your team's size and hiring volume.",
  },
  {
    question: "Can we start with Recruitment Services and move to Talent Acquisition later?",
    answer: "Absolutely — many businesses start with a single search through Recruitment Services and move into an ongoing Talent Acquisition relationship once hiring becomes a recurring need.",
  },
];

export default async function TalentAcquisition() {
  const customContent = await getPageContent("talent-acquisition");
  return (
    <ServicePage
      eyebrow="Services"
      title="Talent Acquisition"
      intro="Long-term hiring strategy for building teams that scale with your business — not just filling a seat for the short term."
      content={customContent || DEFAULT_CONTENT}
      faqs={FAQS}
      image={{
        src: "/images/team-collaboration.jpg",
        alt: "Team collaborating together, representing long-term talent and workforce planning",
      }}
      highlights={[
        "Workforce planning built around where your business is headed, not just today's opening.",
        "A steady pipeline of pre-qualified people, so you're never starting from zero.",
        "Employer branding support that helps the right candidates find you first.",
      ]}
      ctaEyebrow="Connect with us"
      ctaHeading="Speak with a Reflax Advisor"
      ctaQuestion="Thinking about how your team should grow over the next year?"
      ctaBody="Get workforce planning, pipeline building, and employer branding support built around where your business is actually headed."
      ctaTags={["Free initial consultation", "Ongoing strategy reviews", "Pre-vetted talent pipeline"]}
      finalCtaEyebrow="Ready to plan ahead?"
      finalCtaHeading="Let's build your talent pipeline"
      finalCtaBody="Tell us where your business is headed and we'll help you plan the roles you'll need, before you need them urgently."
      finalCtaTags={[
        "No commitment required to start the conversation",
        "Engagements scoped to your hiring volume",
        "Works alongside your existing team",
      ]}
    />
  );
}
