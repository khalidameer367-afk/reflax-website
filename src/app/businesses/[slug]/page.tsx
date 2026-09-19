import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BusinessProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: b, error } = await supabase
    .from("businesses")
    .select("*")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("status", "approved")
    .single();

  if (error || !b) {
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
    <div>
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <Link href="/businesses" className="text-sm text-muted hover:text-ink transition-colors">
            ← All businesses
          </Link>

          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-6">
            {b.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo_url} alt={b.company_name} className="h-20 w-20 border border-line object-contain p-2 shrink-0" />
            ) : (
              <div className="h-20 w-20 border border-line flex items-center justify-center text-2xl font-semibold text-ink shrink-0">
                {b.company_name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                {b.company_name}
              </h1>
              <p className="mt-2 text-muted">{b.industry}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 grid md:grid-cols-[1fr_320px] gap-14">
        <div>
          <h2 className="display text-lg font-semibold text-ink">About</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted whitespace-pre-line">
            {b.description}
          </p>
        </div>

        <aside className="border border-line p-7 h-fit">
          <dl className="space-y-5 text-sm">
            {b.company_size && (
              <div>
                <dt className="text-muted">Company size</dt>
                <dd className="mt-1 text-ink font-medium">{b.company_size}</dd>
              </div>
            )}
            {b.location && (
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="mt-1 text-ink font-medium">{b.location}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Industry</dt>
              <dd className="mt-1 text-ink font-medium">{b.industry}</dd>
            </div>
          </dl>

          <div className="mt-7 pt-7 border-t border-line flex flex-col gap-3">
            <a
              href={`mailto:${b.email}`}
              className="inline-flex items-center justify-center bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
            >
              Contact via email
            </a>
            {b.website && (
              <a
                href={b.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-ink px-5 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Visit website
              </a>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
