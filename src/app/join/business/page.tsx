import type { Metadata } from "next";
import { BusinessJoinForm } from "@/components/JoinForms";

export const metadata: Metadata = {
  title: "Join as a Business — Reflax",
  description: "Our team reviews every business before it goes live on Reflax.",
};

export default function Page() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-10 md:py-12">
          <div className="text-sm text-muted mb-5">Join Reflax</div>
          <h1 className="display text-[2.2rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-xl">
            Add your business to Reflax.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-lg">
            Our team reviews every business before it goes live on Reflax.
          </p>
        </div>
      </section>
      <section className="container-x py-10 md:py-12">
        <BusinessJoinForm />
      </section>
    </div>
  );
}
