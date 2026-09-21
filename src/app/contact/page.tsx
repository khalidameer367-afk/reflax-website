import ContactForm from "@/components/ContactForm";
import { getPageMetadata } from "@/lib/pageSeo";

export async function generateMetadata() {
  return getPageMetadata(
    "contact",
    "Contact Us — Reflax",
    "Questions about hiring or registering your business? Send us a message."
  );
}

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <div className="text-sm text-muted mb-5">Contact us</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-xl">
            Let&apos;s talk.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-lg">
            Questions about hiring, registering your business, or anything
            else — send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>
      <ContactForm />
    </div>
  );
}
