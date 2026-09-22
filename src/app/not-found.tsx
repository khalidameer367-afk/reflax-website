import Link from "next/link";

export const metadata = { title: "Page Not Found — Reflax" };

export default function NotFound() {
  return (
    <div className="container-x py-28 md:py-36 text-center">
      <div className="display text-7xl md:text-8xl font-semibold text-ink/10 mb-4">404</div>
      <h1 className="display text-2xl md:text-3xl font-semibold text-ink">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-4 text-muted max-w-md mx-auto">
        The link might be broken, or the page may have moved. Try one of
        these instead:
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link href="/" className="inline-flex items-center bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-ink/85 transition-colors">
          Go to homepage
        </Link>
        <Link href="/hire-freelancers" className="inline-flex items-center border border-ink px-6 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors">
          Browse freelancers
        </Link>
        <Link href="/contact" className="inline-flex items-center border border-line px-6 py-3 text-sm font-medium text-muted hover:text-ink hover:border-ink transition-colors">
          Contact us
        </Link>
      </div>
    </div>
  );
}
