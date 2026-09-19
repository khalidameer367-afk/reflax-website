import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = { title: "Blog — Reflax" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <div className="text-sm text-muted mb-5">Blog</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            Insights on hiring, growth, and building teams.
          </h1>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        {(!posts || posts.length === 0) && (
          <p className="text-muted">No posts yet — check back soon.</p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block border border-line hover:border-ink transition-colors">
              {post.featured_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.featured_image_url} alt={post.title} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-ink/5 flex items-center justify-center text-muted text-sm">
                  Reflax
                </div>
              )}
              <div className="p-6">
                <h3 className="display text-lg font-semibold text-ink group-hover:underline underline-offset-4">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-muted line-clamp-3">{post.excerpt}</p>
                )}
                <p className="mt-4 text-xs text-muted">
                  {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {post.author ? ` · ${post.author}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
