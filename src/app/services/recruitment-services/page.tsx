import ServicePage from "@/components/ServicePage";

export const metadata = { title: "Recruitment Services — Reflax" };

export default function RecruitmentServices() {
  return (
    <ServicePage
      eyebrow="Services"
      title="Recruitment Services"
      intro="End-to-end hiring support — from sourcing to shortlisting — so you fill roles with people who genuinely fit your team and your goals."
      points={[
        {
          title: "Sourcing & screening",
          copy: "We identify and pre-screen candidates against your role requirements, so you only spend time on qualified matches.",
        },
        {
          title: "Structured shortlisting",
          copy: "Every candidate is evaluated on skills, experience, and fit — with clear notes so your decision is easy and informed.",
        },
        {
          title: "Ongoing support",
          copy: "From offer to onboarding, we stay involved to make sure the hire actually works out for both sides.",
        },
      ]}
      ctaHref="/businesses"
      ctaLabel="Register your business"
    />
  );
}
