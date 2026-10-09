import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/lib/types";
import { shuffleWithFeatured } from "@/lib/shuffle";
import VerifiedBadge from "@/components/VerifiedBadge";
import PageSchema from "@/components/PageSchema";
import { getPageMetadata } from "@/lib/pageSeo";
import { categoryPageKey, categoryDefaults } from "@/lib/pageRegistry";
import { freelancerPath } from "@/lib/schema";

export const revalidate = 60;

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
  if (!cat) return { title: "Freelancers — Reflax", robots: { index: false, follow: false } };
  const d = categoryDefaults(cat);
  return getPageMetadata(categoryPageKey(category), d.title, d.description);
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

  const PAGE_SIZE = 15;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const { data: freelancersRaw, error } = await supabase
    .from("freelancers")
    .select("*")
    .eq("category", cat)
    .eq("status", "approved");
  const shuffled = freelancersRaw ? shuffleWithFeatured(freelancersRaw) : [];

  const totalPages = Math.max(1, Math.ceil(shuffled.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const freelancers = shuffled.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <PageSchema
        pageKey={categoryPageKey(category)}
        items={(freelancers || []).map((f) => ({ name: f.full_name, path: freelancerPath(f) }))}
      />
      <section className="border-b border-line">
        <div className="container-x py-10 md:py-12">
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

      <section className="container-x py-10 md:py-12">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
            {freelancers.map((f) => (
              <Link
                key={f.id}
                href={`/hire-freelancers/${category}/${f.slug || f.id}`}
                className="group block text-center"
              >
                <div className="aspect-square w-full overflow-hidden bg-ink/5">
                  {f.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      loading="lazy"
                      decoding="async"
                      src={f.avatar_url}
                      alt={f.full_name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl font-semibold text-ink/30">
                      {f.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="mt-3 display text-lg md:text-xl font-bold leading-snug text-ink">
                  {f.full_name}
                  {f.verified && (
                    <span className="ml-1.5 inline-block align-middle">
                      <VerifiedBadge />
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-[15px] leading-snug text-muted">{f.title}</p>
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
