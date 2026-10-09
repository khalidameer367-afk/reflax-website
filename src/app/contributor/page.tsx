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
      {/* Hero */}
      <section className="bg-[#37766E] text-white">
        <div className="container-x py-16 md:py-24">
          <div className="text-sm text-white/70 mb-5">Contributors</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight max-w-3xl">
            Guest Posts from Industry Experts
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-white/85 max-w-2xl">
            We accept guest posts from industry experts in technology, education, business, AI,
            digital marketing, and other relevant fields — Guest posts should be written by
            professionals with real-world industry experience.
          </p>
          <Link
            href="/write-for-us#pitch-form"
            className="mt-8 inline-flex items-center bg-white px-7 py-3.5 text-sm font-medium text-[#37766E] hover:bg-ink hover:text-white transition-colors"
          >
            Write for Us
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="border-b border-line">
        <div className="container-x py-12 md:py-16 max-w-4xl">
          <h2 className="display text-3xl md:text-4xl font-semibold leading-tight text-ink">
            Write for Us | Become a Contributor
          </h2>
          <p className="mt-6 text-[16px] leading-[1.8] text-muted">
            We welcome contributions from established professionals from various fields. If you are
            a professional who uses Reflax in some capacity, you are welcome to send in your
            contribution. Non-Reflax users are also welcome to contribute as long as they fit the
            requirements.
          </p>
          <p className="mt-5 text-[16px] leading-[1.8] text-muted">
            This doesn&apos;t mean you have to be famous. But you should be able to show that you
            are an expert in your field and have credentials to prove it.
          </p>
          <ul className="mt-6 space-y-3 list-disc pl-6 text-[16px] leading-[1.8] text-muted marker:text-[#37766E]">
            <li>At a minimum you should have a LinkedIn profile / newsletter / website.</li>
            <li>
              Willing to share the guest post on those channels. If you are not proud to share your
              work, you shouldn&apos;t be contributing.
            </li>
            <li>Having industry qualifications would be an added advantage.</li>
          </ul>
        </div>
      </section>

      {/* Posts */}
      <section className="container-x py-10 md:py-14">
        <h2 className="display text-2xl font-semibold text-ink mb-8">Latest guest posts</h2>
        <ContributorList posts={posts} />
      </section>
    </div>
  );
}
