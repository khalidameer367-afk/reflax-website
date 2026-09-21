import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/lib/supabase";
import { stripHtml } from "@/lib/stripHtml";
import { getPageMetadata } from "@/lib/pageSeo";

export async function generateMetadata() {
  return getPageMetadata(
    "businesses",
    "Businesses — Reflax",
    "A directory of businesses building with Reflax."
  );
}

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
      <section className="border-b border-line relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ink/[0.03] blur-2xl" />
        <div className="container-x py-20 md:py-28 relative">
          <div className="text-sm text-muted mb-5">Businesses</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            A directory of businesses building with Reflax.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-xl">
            Verified companies across every industry — reviewed and listed
            by our team, so freelancers and partners can find and trust
            them at a glance.
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        {(!businesses || businesses.length === 0) && (
          <p className="text-muted">No businesses listed yet — check back soon.</p>
        )}
        {businesses && businesses.length > 0 && (
          <>
            <SectionHeading eyebrow="Directory" title="Registered businesses" />
            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {businesses.map((b) => (
                <Link
                  key={b.id}
                  href={`/businesses/${b.slug || b.id}`}
                  className="group border border-line block hover:border-ink transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                >
                  {b.featured_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.featured_image_url} alt={b.company_name} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-ink/[0.03] flex items-center justify-center">
                      <span className="text-3xl font-semibold text-ink/20">{b.company_name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      {b.logo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.logo_url} alt="" className="h-6 w-auto max-w-[80px] object-contain" />
                      )}
                      <h3 className="display text-lg font-semibold text-ink">{b.company_name}</h3>
                    </div>
                    <p className="text-sm text-muted">{b.industry}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">{stripHtml(b.description)}</p>
                    <span className="mt-4 inline-block text-sm font-medium underline underline-offset-4 group-hover:text-ink">
                      View profile
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
