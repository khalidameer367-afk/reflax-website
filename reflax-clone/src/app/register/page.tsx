import FreelancerForm from "@/components/FreelancerForm";

export const metadata = { title: "Register as a Freelancer — Reflax" };

export default function RegisterPage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <div className="text-sm text-muted mb-5">Join Reflax</div>
          <h1 className="display text-[2.2rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-xl">
            Register as a freelancer or expert.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-lg">
            Fill in your details below. Our team reviews every application —
            once approved, your profile goes live and businesses can find
            and contact you.
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 max-w-2xl">
        <FreelancerForm />
      </section>
    </div>
  );
}
