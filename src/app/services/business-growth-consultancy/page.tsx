import ServicePage from "@/components/ServicePage";

export const metadata = { title: "Business Growth Consultancy — Reflax" };

export default function BusinessGrowthConsultancy() {
  return (
    <ServicePage
      eyebrow="Services"
      title="Business Growth Consultancy"
      intro="Practical guidance on branding, marketing, and operations to help your business grow with intent — not guesswork."
      points={[
        {
          title: "Brand & positioning",
          copy: "Clarify what makes your business different and make sure that comes through everywhere customers see you.",
        },
        {
          title: "Growth marketing",
          copy: "Practical, budget-aware marketing plans focused on the channels that will actually move the needle for you.",
        },
        {
          title: "Operational strategy",
          copy: "We look at how your business runs day to day and identify the changes that free up time and reduce cost.",
        },
      ]}
      ctaHref="/businesses"
      ctaLabel="Talk to us"
    />
  );
}
