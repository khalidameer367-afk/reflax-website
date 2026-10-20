import type { NextConfig } from "next";
import { CATEGORY_CONFIG } from "./src/lib/categories";

const nextConfig: NextConfig = {
  // Old category URLs (before the rename) permanently redirect to the new ones.
  async redirects() {
    return CATEGORY_CONFIG.flatMap((c) =>
      c.oldSlugs.flatMap((old) => [
        { source: `/hire-freelancers/${old}`, destination: `/hire-freelancers/${c.slug}`, permanent: true },
        { source: `/hire-freelancers/${old}/:path*`, destination: `/hire-freelancers/${c.slug}/:path*`, permanent: true },
      ])
    );
  },
};

export default nextConfig;
