import { supabase } from "@/lib/supabase";
import type { EntrepreneurProfile } from "@/lib/types";

export const metadata = { title: "Profiles — Reflax" };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilesPage() {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("category", { ascending: true });

  const grouped: Record<string, EntrepreneurProfile[]> = {};
  (profiles || []).forEach((p: EntrepreneurProfile) => {
    grouped[p.category] = grouped[p.category] || [];
    grouped[p.category].push(p);
  });

  const categories = Object.keys(grouped);

  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <div className="text-sm text-muted mb-5">Profiles</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            Entrepreneurs and business leaders, by category.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-xl">
            A curated directory of standout founders and professionals
            across industries.
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        {categories.length === 0 && (
          <p className="text-muted">No profiles have been added yet.</p>
        )}

        {categories.map((cat) => (
          <div key={cat} className="mb-16">
            <h2 className="display text-xl font-semibold text-ink mb-6">{cat}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {grouped[cat].map((p) => (
                <div key={p.id} className="border border-line p-7">
                  <div className="h-14 w-14 rounded-full bg-ink/5 border border-line flex items-center justify-center text-lg font-semibold text-ink">
                    {p.full_name.charAt(0)}
                  </div>
                  <h3 className="display mt-5 text-lg font-semibold text-ink">{p.full_name}</h3>
                  <p className="mt-1 text-sm text-muted">{p.title}</p>
                  {p.company_name && (
                    <p className="mt-1 text-sm text-muted">{p.company_name}</p>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-3">{p.bio}</p>
                  <div className="mt-4 flex gap-4">
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs font-medium underline underline-offset-4">
                        Website
                      </a>
                    )}
                    {p.linkedin_url && (
                      <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium underline underline-offset-4">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
