import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getPageMetadata } from "@/lib/pageSeo";
import PageSchema from "@/components/PageSchema";
import ContributorList from "@/components/ContributorList";

export async function generateMetadata() {
  return getPageMetadata(
    "contributor",
    "Contributor Posts — Reflax",
    "Guest posts from industry experts on technology, education, business, AI and digital marketing."
  );
}
export const revalidate = 60;

export default async function ContributorPage() {
  const { data } = await supabase
    .from("contributor_posts")
    .select("id, slug, title, excerpt, featured_image_url, author, niche, created_at")
    .order("created_at", { ascending: false });
  const posts = data || [];

  return (
    <div>
      <PageSchema pageKey="contributor" items={posts.map((p) => ({ name: p.title, path: `/contributor/${p.slug}` }))} />
      <section className="border-b border-line">
        <div className="container-x py-14 md:py-20">
          <div className="text-sm text-muted mb-5">Contributors</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            Guest posts from industry experts.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-xl">
            Technology, education, business, AI and digital marketing — written by professionals who work in the field.
          </p>
          <Link
            href="/write-for-us"
            className="mt-7 inline-flex items-center border border-ink px-6 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            Write for Us
          </Link>
        </div>
      </section>

      <section className="container-x py-10 md:py-12">
        <ContributorList posts={posts} />
      </section>
    </div>
  );
}
