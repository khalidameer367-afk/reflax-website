import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/lib/types";
import { shuffle } from "@/lib/shuffle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function slugify(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function unslugify(slug: string) {
  return CATEGORIES.find((c) => slugify(c) === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = unslugify(category);
  return { title: cat ? `${cat} Freelancers — Reflax` : "Freelancers — Reflax" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const cat = unslugify(category);

  if (!cat) {
    return (
      <div className="container-x py-24">
        <p className="text-muted">Category not found.</p>
        <Link href="/hire-freelancers" className="text-sm underline underline-offset-4 mt-4 inline-block">
          ← Back to all categories
        </Link>
      </div>
    );
  }

  const PAGE_SIZE = 12;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const { data: freelancersRaw, error } = await supabase
    .from("freelancers")
    .select("*")
    .eq("category", cat)
    .eq("status", "approved");
  const shuffled = freelancersRaw ? shuffle(freelancersRaw) : [];

  const totalPages = Math.max(1, Math.ceil(shuffled.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const freelancers = shuffled.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <Link href="/hire-freelancers" className="text-sm text-muted hover:text-ink transition-colors">
            ← All categories
          </Link>
          <h1 className="display mt-4 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
            {cat}
          </h1>
          {CATEGORY_DESCRIPTIONS[cat] && (
            <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-2xl">
              {CATEGORY_DESCRIPTIONS[cat]}
            </p>
          )}
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        {error && (
          <p className="text-sm text-muted">
            Couldn&apos;t load freelancers right now. Please check back shortly.
          </p>
        )}

        {!error && (!freelancers || freelancers.length === 0) && (
          <div className="border border-line p-12 text-center">
            <p className="text-muted">
              No approved freelancers in this category yet. Check back soon —
              or if you&apos;re a {cat.toLowerCase()} expert,
            </p>
            <Link href="/register" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
              apply to join Reflax
            </Link>
          </div>
        )}

        {freelancers && freelancers.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {freelancers.map((f) => (
              <Link
                key={f.id}
                href={`/hire-freelancers/${category}/${f.slug || f.id}`}
                className="tilt-3d group border border-line p-7 hover:border-ink transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-full bg-ink/5 border border-line flex items-center justify-center text-lg font-semibold text-ink overflow-hidden">
                  {f.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.avatar_url} alt={f.full_name} className="h-full w-full object-cover" />
                  ) : (
                    f.full_name.charAt(0)
                  )}
                </div>
                <h3 className="display mt-5 text-lg font-semibold text-ink">{f.full_name}</h3>
                <p className="mt-1 text-sm text-muted">{f.title}</p>
                {f.location && <p className="mt-3 text-xs text-muted">{f.location}</p>}
                <span className="mt-5 inline-block text-sm font-medium text-ink underline underline-offset-4">
                  View profile
                </span>
              </Link>
            ))}
          </div>
        )}

        {freelancers && freelancers.length > 0 && totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link
                href={`/hire-freelancers/${category}?page=${currentPage - 1}`}
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
                href={`/hire-freelancers/${category}?page=${currentPage + 1}`}
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
