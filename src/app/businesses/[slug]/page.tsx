import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isUuid } from "@/lib/isUuid";
import { buildMetadata } from "@/lib/seoMeta";
import { stripHtml } from "@/lib/stripHtml";
import VerifiedBadge from "@/components/VerifiedBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBusiness(slug: string) {
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq(isUuid(slug) ? "id" : "slug", slug)
    .eq("status", "approved")
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getBusiness(slug);
  if (!b) return { title: "Business — Reflax" };
  return buildMetadata(b, `${b.company_name} — Reflax`, stripHtml(b.description, 160));
}

export default async function BusinessProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = await getBusiness(slug);

  if (!b) {
    return (
      <div className="container-x py-24">
        <p className="text-muted">This business profile isn&apos;t available.</p>
        <Link href="/businesses" className="text-sm underline underline-offset-4 mt-4 inline-block">
          ← Back to businesses
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: b.company_name,
            description: stripHtml(b.description, 300),
            image: b.logo_url || b.featured_image_url || undefined,
            email: b.email || undefined,
            telephone: b.phone || undefined,
            url: b.website || undefined,
            address: b.location ? { "@type": "PostalAddress", addressLocality: b.location } : undefined,
          }),
        }}
      />
      <Link href="/businesses" className="text-sm text-muted hover:text-ink transition-colors">
        ← All businesses
      </Link>

      <div className="mt-8 grid md:grid-cols-[7fr_3fr] gap-12 items-start">
        {/* Main content — 70% */}
        <article>
          {b.featured_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={b.featured_image_url}
              alt={b.company_name}
              className="w-full h-64 md:h-96 object-cover mb-8"
            />
          )}

          <div className="flex items-center gap-4 mb-2 flex-wrap">
            {b.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo_url} alt="" className="h-10 w-auto max-w-[120px] object-contain" />
            )}
            <h1 className="display text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-tight text-ink">
              {b.company_name}
            </h1>
            {b.verified && <VerifiedBadge />}
          </div>
          <p className="text-sm text-muted mb-8">{b.industry}{b.location ? ` · ${b.location}` : ""}</p>

          <div
            className="blog-content text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: b.description }}
          />
        </article>

        {/* Sidebar — 30%, sticky */}
        <aside className="md:sticky md:top-28 h-fit border border-line p-7">
          <h2 className="display text-sm font-semibold text-ink uppercase tracking-wide mb-1">
            Want to contact {b.company_name}?
          </h2>
          <p className="text-sm text-muted mb-6">Reach out directly using the details below.</p>

          <div className="space-y-3">
            {b.email && (
              <a
                href={`mailto:${b.email}`}
                className="flex items-center justify-center gap-2 bg-ink text-paper px-5 py-3 text-sm font-medium hover:bg-ink/85 transition-colors"
              >
                Email {b.company_name}
              </a>
            )}
            {b.phone && (
              <a
                href={`tel:${b.phone}`}
                className="flex items-center justify-center gap-2 border border-ink px-5 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Call {b.phone}
              </a>
            )}
            {b.website && (
              <a
                href={b.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-line px-5 py-3 text-sm font-medium text-muted hover:text-ink hover:border-ink transition-colors"
              >
                Visit website
              </a>
            )}
          </div>

          <dl className="mt-7 pt-7 border-t border-line space-y-4 text-sm">
            {b.company_size && (
              <div>
                <dt className="text-muted">Company size</dt>
                <dd className="mt-1 text-ink font-medium">{b.company_size}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Industry</dt>
              <dd className="mt-1 text-ink font-medium">{b.industry}</dd>
            </div>
            {b.location && (
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="mt-1 text-ink font-medium">{b.location}</dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </div>
  );
}
