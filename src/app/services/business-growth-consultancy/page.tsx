import ServicePage from "@/components/ServicePage";
import { getPageMetadata, getPageContent } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "business-growth-consultancy",
    "Business Growth Consultancy — Reflax",
    "Practical brand, marketing, and operations consultancy from Reflax to help your business grow with intent, not guesswork."
  );
}

const DEFAULT_CONTENT = `
<h2>Growth that's planned, not accidental</h2>
<p>Most small and mid-sized businesses don't have a growth problem because they're doing something wrong — they have one because they're doing ten things at once, with no clear sense of which of them actually moves the needle. Reflax's Business Growth Consultancy exists to bring focus back into that picture: what's working, what's wasting money, and what should happen next, in a clear order.</p>

<h2>How we approach business growth</h2>
<p>We don't believe in generic playbooks. Every engagement starts with an honest look at where your business actually stands today, before we talk about where it should go.</p>
<h3>1. Brand and positioning</h3>
<p>We help clarify what genuinely makes your business different, and make sure that message is consistent everywhere a customer might encounter you — your website, your listings, your conversations with prospects.</p>
<h3>2. Growth marketing</h3>
<p>Rather than spreading budget thin across every channel, we build practical, budget-aware marketing plans focused on the two or three channels most likely to actually move revenue for your specific business.</p>
<h3>3. Operational strategy</h3>
<p>Growth often stalls not because of marketing, but because of how the business runs day to day. We look at your operations to find the friction points — the processes eating time and money that could be simplified or removed entirely.</p>
<h3>4. Execution support</h3>
<p>A strategy document that sits unused helps nobody. We stay involved through execution, checking progress against the plan and adjusting as real-world results come in.</p>

<h2>Who this is for</h2>
<p>This consultancy is built for small and mid-sized businesses that have some traction already but feel like growth has plateaued, or that are growing but can't tell which of their efforts are actually responsible for it. It's equally useful for a business preparing to scale and wanting a clear-eyed plan before committing budget to the next phase.</p>

<h2>Why work with Reflax on growth</h2>
<p>Because we sit at the intersection of hiring and business strategy, we see growth from both sides — the people side and the operational side. That means our recommendations aren't just theoretical marketing advice; they account for who you'd actually need to hire to execute them, which is often the missing piece in a growth plan built in isolation.</p>
`;

const FAQS = [
  {
    question: "What does a typical Business Growth Consultancy engagement look like?",
    answer: "It usually starts with a discovery phase to understand your current position, followed by a focused plan across brand, marketing, and operations, then ongoing support as you execute it.",
  },
  {
    question: "How long before we see results?",
    answer: "It varies by business and by channel — operational fixes can show results within weeks, while brand and marketing shifts typically take a few months to compound.",
  },
  {
    question: "Do you only work with businesses already on Reflax?",
    answer: "No — this consultancy is open to any business, whether or not you're already registered or hiring through the Reflax platform.",
  },
  {
    question: "Can you help with a specific problem, like weak conversion or high churn, rather than a full strategy?",
    answer: "Yes. Many engagements start narrow — solving one specific bottleneck — before expanding into a broader growth plan if it makes sense.",
  },
  {
    question: "Do you handle the execution, or just the strategy?",
    answer: "Both, depending on what you need. Some clients want a plan and execute it internally; others want us to stay involved through execution, including connecting you with freelancers on Reflax to help carry it out.",
  },
  {
    question: "Is this suitable for a very early-stage startup?",
    answer: "It can be, though this service tends to add the most value once a business has some traction and real data to work from, rather than at the pure idea stage.",
  },
  {
    question: "How is pricing structured?",
    answer: "Pricing depends on the scope — a focused, single-problem engagement is priced differently from an ongoing strategy relationship. Reach out through our contact page for a quote.",
  },
  {
    question: "Can this consultancy help us figure out who to hire next?",
    answer: "Yes — because we also run Recruitment Services and Talent Acquisition, growth recommendations naturally connect to practical hiring plans when relevant.",
  },
];

export default async function BusinessGrowthConsultancy() {
  const customContent = await getPageContent("business-growth-consultancy");
  return (
    <ServicePage
      eyebrow="Services"
      title="Business Growth Consultancy"
      intro="Practical guidance on branding, marketing, and operations to help your business grow with intent — not guesswork."
      content={customContent || DEFAULT_CONTENT}
      faqs={FAQS}
      image={{
        src: "/images/business-growth-review.jpg",
        alt: "Business advisors reviewing growth and performance analytics together",
      }}
      highlights={[
        "Practical, honest advice on branding, marketing, and operations — not generic playbooks.",
        "Recommendations grounded in what's actually happening in your business today.",
        "A clear focus on what to prioritize next, instead of trying to fix everything at once.",
      ]}
    />
  );
}
