import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    return (
      <div className="container-x py-24">
        <p className="text-muted">This post isn&apos;t available.</p>
        <Link href="/blog" className="text-sm underline underline-offset-4 mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  const { data: recentRaw } = await supabase
    .from("blog_posts")
    .select("id, slug, title, featured_image_url, created_at")
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const recent = recentRaw || [];

  return (
    <div className="container-x py-12 md:py-16">
      <Link href="/blog" className="text-sm text-muted hover:text-ink transition-colors">
        ← All posts
      </Link>

      <div className="mt-8 grid md:grid-cols-[7fr_3fr] gap-12 items-start">
        {/* Main content — 70% */}
        <article>
          {post.featured_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover mb-8"
            />
          )}
          <h1 className="display text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-tight text-ink">
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

        {/* Sidebar — 30%, sticky */}
        <aside className="md:sticky md:top-28 h-fit">
          <h2 className="display text-sm font-semibold text-ink uppercase tracking-wide mb-5">
            Recent posts
          </h2>
          <div className="space-y-5">
            {recent.length === 0 && <p className="text-sm text-muted">No other posts yet.</p>}
            {recent.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="flex gap-4 group">
                {r.featured_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.featured_image_url} alt={r.title} className="h-16 w-16 object-cover shrink-0" />
                ) : (
                  <div className="h-16 w-16 bg-ink/5 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-ink group-hover:underline underline-offset-4 leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
