import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isUuid } from "@/lib/isUuid";
import { buildMetadata } from "@/lib/seoMeta";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getFreelancer(slug: string) {
  const { data } = await supabase
    .from("freelancers")
    .select("*")
    .eq(isUuid(slug) ? "id" : "slug", slug)
    .eq("status", "approved")
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params;
  const f = await getFreelancer(slug);
  if (!f) return { title: "Freelancer — Reflax" };
  return buildMetadata(f, `${f.full_name} — ${f.title} — Reflax`, f.bio?.slice(0, 160));
}

export default async function FreelancerProfile({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const f = await getFreelancer(slug);

  if (!f) {
    return (
      <div className="container-x py-24">
        <p className="text-muted">This profile isn&apos;t available.</p>
        <Link href={`/hire-freelancers/${category}`} className="text-sm underline underline-offset-4 mt-4 inline-block">
          ← Back to category
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
            name: f.full_name,
            jobTitle: f.title,
            description: f.bio?.slice(0, 300),
            image: f.avatar_url || undefined,
            email: f.email || undefined,
            telephone: f.phone || undefined,
            url: f.portfolio_url || undefined,
            address: f.location ? { "@type": "PostalAddress", addressLocality: f.location } : undefined,
            knowsAbout: f.skills?.length > 0 ? f.skills : undefined,
          }),
        }}
      />
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <Link href={`/hire-freelancers/${category}`} className="text-sm text-muted hover:text-ink transition-colors">
            ← {f.category}
          </Link>

          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-ink/5 border border-line flex items-center justify-center text-2xl font-semibold text-ink shrink-0 overflow-hidden">
              {f.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.avatar_url} alt={f.full_name} className="h-full w-full object-cover" />
              ) : (
                f.full_name.charAt(0)
              )}
            </div>
            <div>
              <h1 className="display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                {f.full_name}
              </h1>
              <p className="mt-2 text-muted">{f.title}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 grid md:grid-cols-[1fr_320px] gap-14">
        <div>
          <h2 className="display text-lg font-semibold text-ink">About</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted whitespace-pre-line">
            {f.bio}
          </p>

          {f.skills?.length > 0 && (
            <div className="mt-10">
              <h2 className="display text-lg font-semibold text-ink">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {f.skills.map((s: string) => (
                  <span key={s} className="border border-line px-3 py-1.5 text-sm text-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="border border-line p-7 h-fit">
          <dl className="space-y-5 text-sm">
            {f.experience_years !== null && (
              <div>
                <dt className="text-muted">Experience</dt>
                <dd className="mt-1 text-ink font-medium">{f.experience_years} years</dd>
              </div>
            )}
            {f.hourly_rate && (
              <div>
                <dt className="text-muted">Rate</dt>
                <dd className="mt-1 text-ink font-medium">{f.hourly_rate}</dd>
              </div>
            )}
            {f.phone && (
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-1 text-ink font-medium">{f.phone}</dd>
              </div>
            )}
            {f.location && (
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="mt-1 text-ink font-medium">{f.location}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Category</dt>
              <dd className="mt-1 text-ink font-medium">{f.category}</dd>
            </div>
          </dl>

          <div className="mt-7 pt-7 border-t border-line flex flex-col gap-3">
            <a
              href={`mailto:${f.email}`}
              className="inline-flex items-center justify-center bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
            >
              Contact via email
            </a>
            {f.phone && (
              <a
                href={`tel:${f.phone}`}
                className="inline-flex items-center justify-center border border-ink px-5 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Call {f.phone}
              </a>
            )}
            {f.portfolio_url && (
              <a
                href={f.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-line px-5 py-3 text-sm font-medium text-muted hover:text-ink hover:border-ink transition-colors"
              >
                View portfolio
              </a>
            )}
            {f.linkedin_url && (
              <a
                href={f.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-line px-5 py-3 text-sm font-medium text-muted hover:text-ink hover:border-ink transition-colors"
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
