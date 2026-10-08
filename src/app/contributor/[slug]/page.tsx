import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buildMetadata } from "@/lib/pageSeo";
import { JsonLd } from "@/components/PageSchema";
import { contributorPostSchema, contributorPath } from "@/lib/schema";
import { stripHtml } from "@/lib/stripHtml";
import { nicheLabel } from "@/lib/types";

export const revalidate = 60;

// Render each detail page on first visit, then serve it from cache.
export async function generateStaticParams() {
  return [];
}

async function getPost(slug: string) {
  const { data } = await supabase.from("contributor_posts").select("*").eq("slug", slug).single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post — Reflax", robots: { index: false, follow: false } };
  return buildMetadata(post, `${post.title} — Reflax`, post.excerpt || stripHtml(post.content, 160), {
    path: contributorPath(post),
    image: post.featured_image_url,
    type: "article",
  });
}

export default async function ContributorPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="container-x py-24">
        <p className="text-muted">This post isn&apos;t available.</p>
        <Link href="/contributor" className="text-sm underline underline-offset-4 mt-4 inline-block">
          ← Back to contributor posts
        </Link>
      </div>
    );
  }

  const { data: recentRaw } = await supabase
    .from("contributor_posts")
    .select("id, slug, title, featured_image_url, created_at")
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);
  const recent = recentRaw || [];

  return (
    <div className="container-x py-12 md:py-16">
      <JsonLd data={contributorPostSchema(post)} />
      <Link href="/contributor" className="text-sm text-muted hover:text-ink transition-colors">
        ← All contributor posts
      </Link>

      <div className="mt-8 grid md:grid-cols-[7fr_3fr] gap-12 items-start">
        <article>
          {post.featured_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.featured_image_url} alt={post.title} className="w-full h-64 md:h-96 object-cover mb-8" />
          )}
          <span className="text-[11px] font-medium text-ink bg-ink/[0.06] border border-ink/15 px-2 py-[2px]">
            {nicheLabel(post.niche)}
          </span>
          <h1 className="mt-4 display text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-tight text-ink">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-muted">
            {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {post.author ? ` · ${post.author}` : ""}
          </p>
          <div
            className="mt-8 blog-content text-[16px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <aside className="md:sticky md:top-28 h-fit">
          <h2 className="display text-sm font-semibold text-ink uppercase tracking-wide mb-5">Recent posts</h2>
          <div className="space-y-5">
            {recent.length === 0 && <p className="text-sm text-muted">No other posts yet.</p>}
            {recent.map((r) => (
              <Link key={r.id} href={`/contributor/${r.slug}`} className="flex gap-4 group">
                {r.featured_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img loading="lazy" decoding="async" src={r.featured_image_url} alt={r.title} className="h-16 w-16 object-cover shrink-0" />
                ) : (
                  <div className="h-16 w-16 bg-ink/5 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-ink group-hover:underline underline-offset-4 leading-snug">{r.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/write-for-us"
            className="mt-8 inline-flex items-center border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            Write for Us
          </Link>
        </aside>
      </div>
    </div>
  );
}
