import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isUuid } from "@/lib/isUuid";
import { buildMetadata } from "@/lib/seoMeta";
import { stripHtml } from "@/lib/stripHtml";
import VerifiedBadge from "@/components/VerifiedBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProfile(slug: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq(isUuid(slug) ? "id" : "slug", slug)
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProfile(slug);
  if (!p) return { title: "Profile — Reflax" };
  return buildMetadata(p, `${p.full_name} — ${p.title} — Reflax`, stripHtml(p.bio, 160));
}

export default async function EntrepreneurProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProfile(slug);

  if (!p) {
    return (
      <div className="container-x py-24">
        <p className="text-muted">This profile isn&apos;t available.</p>
        <Link href="/profiles" className="text-sm underline underline-offset-4 mt-4 inline-block">
          ← Back to profiles
        </Link>
      </div>
    );
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: p.full_name,
            jobTitle: p.title,
            worksFor: p.company_name ? { "@type": "Organization", name: p.company_name } : undefined,
            description: stripHtml(p.bio, 300),
            image: p.avatar_url || undefined,
            url: p.website || undefined,
            address: p.location ? { "@type": "PostalAddress", addressLocality: p.location } : undefined,
            sameAs: p.linkedin_url ? [p.linkedin_url] : undefined,
          }),
        }}
      />
      {/* Premium hero */}
      <section className="relative border-b border-line overflow-hidden bg-ink text-paper">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-paper/[0.04] blur-3xl" />
        <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-paper/[0.04] blur-3xl" />
        <div className="container-x py-20 md:py-28 relative">
          <Link href="/profiles" className="text-sm text-paper/50 hover:text-paper transition-colors">
            ← All profiles
          </Link>

          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-paper/10 bg-paper/5 flex items-center justify-center text-4xl font-semibold text-paper shrink-0 overflow-hidden">
              {p.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatar_url} alt={p.full_name} className="h-full w-full object-cover" />
              ) : (
                p.full_name.charAt(0)
              )}
            </div>
            <div>
              {p.category && (
                <div className="text-sm text-paper/50 mb-2 uppercase tracking-wide">{p.category}</div>
              )}
              <h1 className="display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-paper flex items-center gap-3 flex-wrap">
                {p.full_name}
                {p.verified && <VerifiedBadge dark />}
              </h1>
              <p className="mt-3 text-lg text-paper/70">
                {p.title}{p.company_name ? ` · ${p.company_name}` : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 grid md:grid-cols-[1fr_320px] gap-14">
        <div>
          <h2 className="display text-lg font-semibold text-ink">About</h2>
          <div
            className="mt-4 blog-content text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: p.bio }}
          />
        </div>

        <aside className="md:sticky md:top-28 h-fit border border-line p-7">
          <dl className="space-y-5 text-sm">
            {p.category && (
              <div>
                <dt className="text-muted">Category</dt>
                <dd className="mt-1 text-ink font-medium">{p.category}</dd>
              </div>
            )}
            {p.company_name && (
              <div>
                <dt className="text-muted">Company</dt>
                <dd className="mt-1 text-ink font-medium">{p.company_name}</dd>
              </div>
            )}
            {p.location && (
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="mt-1 text-ink font-medium">{p.location}</dd>
              </div>
            )}
          </dl>

          <div className="mt-7 pt-7 border-t border-line flex flex-col gap-3">
            {p.website && (
              <a
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
              >
                Visit website
              </a>
            )}
            {p.linkedin_url && (
              <a
                href={p.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-ink px-5 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                LinkedIn profile
              </a>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
