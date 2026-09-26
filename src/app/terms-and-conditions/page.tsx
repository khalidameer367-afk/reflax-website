import Link from "next/link";
import { getPageMetadata } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return getPageMetadata(
    "terms-and-conditions",
    "Terms & Conditions — Reflax",
    "The terms that govern your use of the Reflax platform."
  );
}

export default function TermsAndConditions() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-24">
          <div className="text-sm text-muted mb-5">Legal</div>
          <h1 className="display text-[2.2rem] md:text-4xl font-semibold leading-[1.1] tracking-tight text-ink">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm text-muted">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="max-w-3xl space-y-10 text-[15px] leading-relaxed text-ink">
          <p className="text-muted">
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your
            access to and use of the Reflax website and services. By using
            Reflax, you agree to these Terms. If you do not agree, please
            do not use the platform.
          </p>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">1. Who we are</h2>
            <p className="text-muted">
              Reflax is a platform that connects businesses with verified
              freelancers, experts, and entrepreneurs, and offers
              recruitment, talent acquisition, and business growth services.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">2. Eligibility and registration</h2>
            <p className="text-muted">
              To register as a freelancer, business, or profile on Reflax,
              you must provide accurate and truthful information. We reserve
              the right to review, approve, reject, or remove any submission
              at our discretion, including listings that appear misleading,
              fraudulent, or inappropriate.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">3. No guarantee of outcomes</h2>
            <p className="text-muted">
              Reflax acts as a directory and connection point between
              businesses and independent freelancers, experts, and
              consultants. We do not employ freelancers listed on the
              platform, and we do not guarantee the quality, availability,
              or outcome of any work, hire, or engagement arranged between
              users. Any agreement, payment, or work arrangement is solely
              between the parties involved.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">4. User conduct</h2>
            <p className="text-muted">You agree not to:</p>
            <ul className="mt-4 space-y-2 text-muted list-disc pl-5">
              <li>Submit false, misleading, or fraudulent information.</li>
              <li>Use the platform for any unlawful purpose.</li>
              <li>Attempt to interfere with, disrupt, or gain unauthorized access to the platform or its systems.</li>
              <li>Copy, scrape, or republish content from Reflax without permission.</li>
            </ul>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">5. Content and submissions</h2>
            <p className="text-muted">
              By submitting a profile, listing, article, or other content to
              Reflax, you confirm that you own the rights to that content
              or have permission to share it, and you grant Reflax the
              right to publish and display it on the platform. Reflax may
              edit submissions for clarity, formatting, or policy
              compliance before publishing.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">6. Intellectual property</h2>
            <p className="text-muted">
              The Reflax name, logo, website design, and platform are the
              property of Reflax and may not be used or reproduced without
              our written permission.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">7. Third-party links</h2>
            <p className="text-muted">
              Reflax may contain links to third-party websites, including
              freelancer or business websites and social profiles. We are
              not responsible for the content, accuracy, or practices of
              any third-party site.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">8. Limitation of liability</h2>
            <p className="text-muted">
              To the fullest extent permitted by law, Reflax shall not be
              liable for any indirect, incidental, or consequential damages
              arising from your use of the platform, including any dispute,
              loss, or damage resulting from an engagement between a
              business and a freelancer or expert listed on the site.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">9. Changes to these terms</h2>
            <p className="text-muted">
              We may update these Terms from time to time. Continued use of
              Reflax after changes are posted constitutes acceptance of the
              updated Terms.
            </p>
          </div>

          <div>
            <h2 className="display text-lg font-semibold text-ink mb-3">10. Contact us</h2>
            <p className="text-muted">
              If you have questions about these Terms, please{" "}
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
