import type { NextConfig } from "next";
import { CATEGORY_CONFIG, REMOVED_CATEGORY_SLUGS } from "./src/lib/categories";

const nextConfig: NextConfig = {
  // Old category URLs (before the rename) permanently redirect to the new ones.
  async redirects() {
    const renamed = CATEGORY_CONFIG.flatMap((c) =>
      c.oldSlugs.flatMap((old) => [
        { source: `/hire-freelancers/${old}`, destination: `/hire-freelancers/${c.slug}`, permanent: true },
        { source: `/hire-freelancers/${old}/:path*`, destination: `/hire-freelancers/${c.slug}/:path*`, permanent: true },
      ])
    );
    // Removed categories: send visitors to the main freelancers page.
    const removed = REMOVED_CATEGORY_SLUGS.flatMap((slug) => [
      { source: `/hire-freelancers/${slug}`, destination: "/hire-freelancers", permanent: true },
      { source: `/hire-freelancers/${slug}/:path*`, destination: "/hire-freelancers", permanent: true },
    ]);
    return [...renamed, ...removed];
  },
};

export default nextConfig;
