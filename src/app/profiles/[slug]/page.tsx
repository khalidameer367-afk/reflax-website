import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isUuid } from "@/lib/slug";
import { buildMetadata } from "@/lib/pageSeo";
import { JsonLd } from "@/components/PageSchema";
import { profileSchema, profilePath } from "@/lib/schema";
import { stripHtml } from "@/lib/stripHtml";
import VerifiedBadge from "@/components/VerifiedBadge";

export const revalidate = 60;

// Render each detail page on first visit, then serve it from cache.
export async function generateStaticParams() {
  return [];
}

async function getProfile(slug: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq(isUuid(slug) ? "id" : "slug", slug)
    .single();
  // Profiles still waiting for approval are not public (older rows have no status).
  if (data && data.status && data.status !== "approved") return null;
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProfile(slug);
  if (!p) return { title: "Profile — Reflax", robots: { index: false, follow: false } };
  return buildMetadata(p, `${p.full_name} — ${p.title} — Reflax`, stripHtml(p.bio, 160), {
    path: profilePath(p),
    image: p.avatar_url,
    type: "profile",
  });
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
      <JsonLd data={profileSchema(p)} />
      {/* Premium hero */}
      <section className="relative border-b border-line overflow-hidden bg-ink text-paper">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-paper/[0.04] blur-3xl" />
        <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-paper/[0.04] blur-3xl" />
        <div className="container-x py-14 md:py-20 relative">
          <Link href="/profiles" className="text-sm text-paper/50 hover:text-paper transition-colors">
            ← All profiles
          </Link>

          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-paper/10 bg-paper/5 flex items-center justify-center text-4xl font-semibold text-paper shrink-0 overflow-hidden">
              {p.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img loading="lazy" decoding="async" src={p.avatar_url} alt={p.full_name} className="h-full w-full object-cover" />
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

      <section className="container-x py-10 md:py-12 grid md:grid-cols-[1fr_320px] gap-14">
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
            {p.email && (
              <a
                href={`mailto:${p.email}`}
                className="inline-flex items-center justify-center bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-accent hover:text-paper transition-colors"
              >
                Email {p.full_name}
              </a>
            )}
            {p.phone && (
              <a
                href={`tel:${p.phone}`}
                className="inline-flex items-center justify-center border border-accent bg-accent px-5 py-3 text-sm font-medium text-paper hover:bg-ink hover:text-paper transition-colors hover:border-ink"
              >
                Contact {p.phone}
              </a>
            )}
            {p.website && (
              <a
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-[#7C3AED] bg-[#7C3AED] px-5 py-3 text-sm font-medium text-white hover:bg-[#6D28D9] hover:border-[#6D28D9] transition-colors"
              >
                Visit Company
              </a>
            )}
            {p.linkedin_url && (
              <a
                href={p.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-accent bg-accent px-5 py-3 text-sm font-medium text-paper hover:bg-ink hover:text-paper transition-colors hover:border-ink"
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
