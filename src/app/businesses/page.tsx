import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import BusinessForm from "@/components/BusinessForm";
import { supabase } from "@/lib/supabase";

export const metadata = { title: "Businesses — Reflax" };

// Always fetch fresh data — without this, Next.js caches this page at
// build time and newly-approved businesses won't show up until redeploy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BusinessesPage() {
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <div className="text-sm text-muted mb-5">For businesses</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            Register your business and get discovered by top talent.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-xl">
            Add your company to Reflax's directory. A reviewed, verified
            listing builds trust with freelancers and partners looking to
            work with you.
          </p>
        </div>
      </section>

      {businesses && businesses.length > 0 && (
        <section className="container-x py-16 md:py-20 border-b border-line">
          <SectionHeading eyebrow="Directory" title="Registered businesses" />
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {businesses.map((b) => (
              <Link
                key={b.id}
                href={`/businesses/${b.slug || b.id}`}
                className="border border-line p-7 block hover:border-ink transition-colors"
              >
                {b.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo_url} alt={b.company_name} className="h-12 w-auto max-w-[140px] object-contain mb-4" />
                ) : (
                  <div className="h-12 w-12 border border-line flex items-center justify-center text-lg font-semibold text-ink mb-4">
                    {b.company_name.charAt(0)}
                  </div>
                )}
                <h3 className="display text-lg font-semibold text-ink">{b.company_name}</h3>
                <p className="mt-1 text-sm text-muted">{b.industry}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-3">{b.description}</p>
                <span className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
                  View profile
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-x py-16 md:py-20 max-w-2xl">
        <h2 className="display text-2xl font-semibold text-ink mb-8">Register your business</h2>
        <BusinessForm />
      </section>
    </div>
  );
}
