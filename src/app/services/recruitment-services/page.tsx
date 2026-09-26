import ServicePage from "@/components/ServicePage";
import { getPageMetadata, getPageContent } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "recruitment-services",
    "Recruitment Services — Reflax",
    "End-to-end recruitment support from Reflax — sourcing, screening, shortlisting, and onboarding help for growing businesses."
  );
}

const DEFAULT_CONTENT = `
<h2>Hiring the right person, without the guesswork</h2>
<p>Recruitment sounds simple until you're actually doing it. A job post goes live, and within days you're sitting on a hundred applications — most of them irrelevant, a few promising, and almost no way to tell the difference without spending hours you don't have. That's the gap Reflax's Recruitment Services fill. We handle the parts of hiring that eat up the most time — sourcing, screening, and shortlisting — so that by the time a candidate reaches you, you're only ever talking to people who are genuinely worth your time.</p>

<h2>How our recruitment process works</h2>
<p>We start every engagement by understanding the role properly — not just the job title, but what success actually looks like six months in. That conversation shapes everything that follows: the channels we source from, the questions we screen with, and the bar we hold candidates to.</p>
<p>From there, our process runs in four stages:</p>
<h3>1. Role scoping</h3>
<p>We sit down with you (or your hiring manager) to define the must-haves versus the nice-to-haves, the budget range, and what's realistically negotiable. This single step prevents most of the wasted time later in the process.</p>
<h3>2. Sourcing and outreach</h3>
<p>We tap into Reflax's own network of verified freelancers and professionals, plus targeted outreach beyond it, to build a pool of candidates who actually match the role — not just people who happened to apply.</p>
<h3>3. Screening and shortlisting</h3>
<p>Every candidate we put forward has been screened against the role's specific requirements — skills, availability, budget fit, and communication. You get a shortlist with clear notes, not a pile of unfiltered resumes.</p>
<h3>4. Interview support and onboarding</h3>
<p>We stay involved through interviews and offer negotiation, and check in after the hire is made to make sure the fit is actually working — because a hire that doesn't stick isn't really a hire.</p>

<h2>Who this is for</h2>
<p>Our recruitment services work well for startups making their first few hires, small businesses that don't have an internal HR function yet, and growing teams that need to fill a role quickly without lowering their standards. Whether you're hiring a single freelancer for a project or building out a full team, the same structured process applies — scaled to the size of what you need.</p>

<h2>Why businesses work with Reflax for recruitment</h2>
<p>Every professional in our network has already been reviewed before they're ever considered for a role — so you're not starting from zero with unverified applicants. We don't charge a percentage of the candidate's salary the way traditional agencies do, and we don't disappear after the placement is made. Recruitment through Reflax is built to feel less like outsourcing and more like having an extra person on your hiring team.</p>
`;

const FAQS = [
  {
    question: "How long does the recruitment process usually take?",
    answer: "It depends on the role, but most searches move from scoping to a shortlist within one to two weeks, since we're drawing from an already-verified pool of professionals rather than starting a search from scratch.",
  },
  {
    question: "Do you only work with freelancers, or full-time hires too?",
    answer: "Both. While Reflax is known primarily for freelance and contract talent, our recruitment service can support full-time and long-term hiring needs as well.",
  },
  {
    question: "What does Reflax charge for recruitment services?",
    answer: "Pricing depends on the scope of the search — reach out through our contact page with the role details and we'll give you a clear quote before any work begins.",
  },
  {
    question: "Can you help with a role that's very niche or technical?",
    answer: "Yes. Because we source both from our own network and beyond it, we can build a targeted search for specialized or technical roles that are harder to fill through general job postings.",
  },
  {
    question: "Do you guarantee the hire will work out?",
    answer: "We can't guarantee outcomes, but our screening process and post-hire check-ins are specifically designed to reduce the risk of a mismatch, and we'll work with you if something isn't working out.",
  },
  {
    question: "What information do you need from us to start a search?",
    answer: "A clear picture of the role, the budget range, and what success looks like in the first few months. The more specific you are upfront, the faster we can find the right fit.",
  },
  {
    question: "Is this different from just browsing freelancers on Reflax myself?",
    answer: "Yes — browsing is self-service and free. Recruitment services mean our team actively sources, screens, and manages the search on your behalf, which is better suited to roles where you don't have the time to do it yourself.",
  },
  {
    question: "Can I use Recruitment Services for a one-off project instead of an ongoing role?",
    answer: "Absolutely. Many businesses use this service to quickly staff a single project rather than commit to a long-term hire, and the same screening process applies either way.",
  },
];

export default async function RecruitmentServices() {
  const customContent = await getPageContent("recruitment-services");
  return (
    <ServicePage
      eyebrow="Services"
      title="Recruitment Services"
      intro="End-to-end hiring support — from sourcing to shortlisting — so you fill roles with people who genuinely fit your team and your goals."
      content={customContent || DEFAULT_CONTENT}
      faqs={FAQS}
      image={{
        src: "/images/global-talent-network.jpg",
        alt: "Recruiter selecting the right candidate from a global professional network",
      }}
      highlights={[
        "Sourcing and screening handled for you, from a network of pre-verified professionals.",
        "You only meet shortlisted candidates who actually match the role and your team.",
        "Clear, ongoing communication — no black box, no radio silence between updates.",
      ]}
      ctaHeading="Want our Recruitment Services?"
      ctaBody="Tell us about the role and we'll take sourcing, screening, and shortlisting off your plate."
    />
  );
}
