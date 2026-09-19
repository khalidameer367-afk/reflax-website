import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EntrepreneurProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: p, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (error || !p) {
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
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <Link href="/profiles" className="text-sm text-muted hover:text-ink transition-colors">
            ← {p.category}
          </Link>

          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-ink/5 border border-line flex items-center justify-center text-2xl font-semibold text-ink shrink-0 overflow-hidden">
              {p.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatar_url} alt={p.full_name} className="h-full w-full object-cover" />
              ) : (
                p.full_name.charAt(0)
              )}
            </div>
            <div>
              <h1 className="display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                {p.full_name}
              </h1>
              <p className="mt-2 text-muted">{p.title}{p.company_name ? ` · ${p.company_name}` : ""}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 grid md:grid-cols-[1fr_320px] gap-14">
        <div>
          <h2 className="display text-lg font-semibold text-ink">About</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted whitespace-pre-line">
            {p.bio}
          </p>
        </div>

        <aside className="border border-line p-7 h-fit">
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-muted">Category</dt>
              <dd className="mt-1 text-ink font-medium">{p.category}</dd>
            </div>
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
