import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/types";

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
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
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

  const { data: freelancers, error } = await supabase
    .from("freelancers")
    .select("*")
    .eq("category", cat)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

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
                href={`/hire-freelancers/${category}/${f.id}`}
                className="group border border-line p-7 hover:border-ink transition-colors"
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
      </section>
    </div>
  );
}
