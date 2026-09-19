import SectionHeading from "@/components/SectionHeading";

export const metadata = { title: "About Us — Reflax" };

const PILLARS = [
  {
    title: "Our Mission",
    copy: "To connect businesses with the right experts through a simple, reliable, and efficient platform. We make hiring easier by helping companies find verified professionals who truly fit their needs and can support their growth.",
  },
  {
    title: "Our Vision",
    copy: "To become a leading global platform where businesses and professionals connect seamlessly to create meaningful opportunities and sustainable growth — a trusted ecosystem that transforms how companies hire, market their services, and develop their teams.",
  },
  {
    title: "Our Goal",
    copy: "To simplify expert hiring and business growth by providing a reliable, efficient, and results-driven platform — helping companies quickly find the right professionals, build strong teams, and enhance their online presence.",
  },
];

export default function AboutUs() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <div className="text-sm text-muted mb-5">About us</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            Your strategic partner in talent, branding, and business growth.
          </h1>
        </div>
      </section>

      <section className="container-x py-20 md:py-24 border-b border-line">
        <div className="grid md:grid-cols-3 gap-10">
          {PILLARS.map((p) => (
            <div key={p.title}>
              <h3 className="display text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20 md:py-24">
        <SectionHeading
          eyebrow="Beyond hiring"
          title="We go beyond being just another hiring platform."
          description="At Reflax, we believe in creating real opportunities for businesses and professionals. We become your growth partner — supporting your journey from the first hire to long-term expansion."
        />
      </section>
    </div>
  );
}
