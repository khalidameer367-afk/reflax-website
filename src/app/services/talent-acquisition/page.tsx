import ServicePage from "@/components/ServicePage";

export const metadata = { title: "Talent Acquisition — Reflax" };

export default function TalentAcquisition() {
  return (
    <ServicePage
      eyebrow="Services"
      title="Talent Acquisition"
      intro="Long-term hiring strategy for building teams that scale with your business — not just filling a seat for the short term."
      points={[
        {
          title: "Workforce planning",
          copy: "We help you map out the roles and skills your business will need as it grows, ahead of time rather than reactively.",
        },
        {
          title: "Pipeline building",
          copy: "A steady pipeline of pre-vetted talent, ready when you need to hire — so you're never starting from zero.",
        },
        {
          title: "Employer branding",
          copy: "Position your company as a place skilled people actually want to work, improving the quality of every hire.",
        },
      ]}
      ctaHref="/businesses"
      ctaLabel="Register your business"
    />
  );
}
