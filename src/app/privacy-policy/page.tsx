import Link from "next/link";
import { getPageMetadata } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "privacy-policy",
    "Privacy Policy — Reflax",
    "How Reflax collects, uses, and protects your information."
  );
}

export default function PrivacyPolicy() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-24">
          <div className="text-sm text-muted mb-5">Legal</div>
          <h1 className="display text-[2.2rem] md:text-4xl font-semibold leading-[1.1] tracking-tight text-ink">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="max-w-3xl space-y-10 text-[15px] leading-relaxed text-ink">
          <p className="text-muted">
            This Privacy Policy explains how Reflax (&quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects
            information when you use our website and services, including our
            freelancer and business directories, profiles, and blog.
          </p>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">1. Information we collect</h2>
            <p className="text-muted">We may collect the following types of information:</p>
            <ul className="mt-4 space-y-2 text-muted list-disc pl-5">
              <li>Information you provide directly — such as your name, email address, phone number, company details, and any content you submit when registering as a freelancer, business, or entrepreneur profile.</li>
              <li>Contact form and inquiry details — including messages sent through our Contact page.</li>
              <li>Technical information — such as browser type, device information, and pages visited, collected automatically to help us improve the site.</li>
            </ul>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">2. How we use your information</h2>
            <ul className="mt-2 space-y-2 text-muted list-disc pl-5">
              <li>To review, approve, and publish freelancer, business, and profile listings.</li>
              <li>To respond to inquiries submitted through our contact forms.</li>
              <li>To operate, maintain, and improve our website and services.</li>
              <li>To send important updates related to your account or submission status.</li>
              <li>To detect and prevent fraud, abuse, or misuse of the platform.</li>
            </ul>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">3. Public profile information</h2>
            <p className="text-muted">
              If you register as a freelancer, business, or entrepreneur on
              Reflax, certain information you submit (such as your name,
              title, company, bio, and contact details you choose to
              display) will be made publicly visible on your profile page
              once approved. Please avoid submitting information you do not
              wish to be public.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">4. Cookies</h2>
            <p className="text-muted">
              We may use cookies and similar technologies to keep the site
              functioning correctly and to understand how visitors use
              Reflax. You can control or disable cookies through your
              browser settings, though some parts of the site may not
              function as intended without them.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">5. Sharing of information</h2>
            <p className="text-muted">
              We do not sell your personal information. We may share
              information with trusted service providers who help us operate
              the platform (such as hosting and email delivery providers),
              or when required by law.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">6. Data security</h2>
            <p className="text-muted">
              We take reasonable technical and organizational measures to
              protect your information. However, no method of transmission
              or storage over the internet is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">7. Your rights</h2>
            <p className="text-muted">
              You may request access to, correction of, or deletion of your
              personal information held by us — including removing a
              freelancer, business, or profile listing — by contacting us
              using the details below.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">8. Changes to this policy</h2>
            <p className="text-muted">
              We may update this Privacy Policy from time to time. Changes
              will be posted on this page with an updated revision date.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">9. Contact us</h2>
            <p className="text-muted">
              If you have questions about this Privacy Policy or how your
              information is handled, please{" "}
              <Link href="/contact" className="underline underline-offset-4 text-ink">
                get in touch with us
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
