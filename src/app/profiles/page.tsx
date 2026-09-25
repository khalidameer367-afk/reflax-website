import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { stripHtml } from "@/lib/stripHtml";
import { shuffle } from "@/lib/shuffle";
import { getPageMetadata } from "@/lib/pageSeo";

export async function generateMetadata() {
  return getPageMetadata(
    "profiles",
    "Profiles — Reflax",
    "A directory of entrepreneurs and business leaders on Reflax."
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 12;

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const { data: allProfiles } = await supabase.from("profiles").select("*");
  const shuffled = shuffle(allProfiles || []);

  const totalPages = Math.max(1, Math.ceil(shuffled.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = shuffled.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <div className="text-sm text-muted mb-5">Profiles</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            Entrepreneurs and business leaders on Reflax.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-xl">
            A curated directory of standout founders and professionals
            across industries.
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        {pageItems.length === 0 && (
          <p className="text-muted">No profiles have been added yet.</p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {pageItems.map((p) => (
            <Link
              key={p.id}
              href={`/profiles/${p.slug || p.id}`}
              className="tilt-3d border border-line p-7 block hover:border-ink transition-colors"
            >
              <div className="h-14 w-14 rounded-full bg-ink/5 border border-line flex items-center justify-center text-lg font-semibold text-ink overflow-hidden">
                {p.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatar_url} alt={p.full_name} className="h-full w-full object-cover" />
                ) : (
                  p.full_name.charAt(0)
                )}
              </div>
              <h3 className="display mt-5 text-lg font-semibold text-ink">{p.full_name}</h3>
              <p className="mt-1 text-sm text-muted">{p.title}</p>
              {p.company_name && (
                <p className="mt-1 text-sm text-muted">{p.company_name}</p>
              )}
              <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-3">{stripHtml(p.bio)}</p>
              <span className="mt-4 inline-block text-xs font-medium underline underline-offset-4">
                View profile
              </span>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link
                href={`/profiles?page=${currentPage - 1}`}
                className="border border-line px-5 py-2.5 text-sm text-ink hover:border-ink transition-colors"
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm text-muted px-2">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/profiles?page=${currentPage + 1}`}
                className="border border-line px-5 py-2.5 text-sm text-ink hover:border-ink transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
