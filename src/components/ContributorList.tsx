"use client";

import Link from "next/link";
import { nicheLabel } from "@/lib/types";

export interface ContributorCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author: string | null;
  niche: string;
  created_at: string;
}

export default function ContributorList({ posts }: { posts: ContributorCard[] }) {
  const visible = posts;

  return (
    <div>
      {visible.length === 0 && (
        <p className="text-muted">
          No posts yet — check back soon.
        </p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {visible.map((post) => (
          <Link
            key={post.id}
            href={`/contributor/${post.slug}`}
            className="tilt-3d group block border border-line hover:border-ink transition-colors"
          >
            {post.featured_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img loading="lazy" decoding="async" src={post.featured_image_url} alt={post.title} className="w-full h-44 object-cover" />
            ) : (
              <div className="w-full h-44 bg-ink/5 flex items-center justify-center text-muted text-sm">Reflax</div>
            )}
            <div className="p-6">
              <span className="text-[11px] font-medium text-ink bg-ink/[0.06] border border-ink/15 px-2 py-[2px]">
                {nicheLabel(post.niche)}
              </span>
              <h3 className="mt-3 display text-lg font-semibold text-ink group-hover:underline underline-offset-4">
                {post.title}
              </h3>
              {post.excerpt && <p className="mt-2 text-sm text-muted line-clamp-3">{post.excerpt}</p>}
              <p className="mt-4 text-xs text-muted">
                {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {post.author ? ` · ${post.author}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
