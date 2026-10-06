import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo-white.webp"
              alt="Reflax"
              width={140}
              height={50}
              className="h-9 w-auto mb-5"
            />
            <p className="text-sm text-paper/60 max-w-xs leading-relaxed">
              Connecting businesses with verified experts and freelancers —
              and helping professionals find real opportunities.
            </p>

            <a
              href="mailto:Contact@reflax.org"
              className="mt-5 inline-flex items-center gap-2.5 text-sm text-paper/70 hover:text-paper transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              Contact@reflax.org
            </a>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1CwQuyJQ36/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reflax on Facebook"
                className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 hover:bg-paper hover:text-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/reflaxlimited/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reflax on LinkedIn"
                className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 hover:bg-paper hover:text-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9.75h4V21H3V9.75zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.59V21h-4V9.75z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Reflaxorg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reflax on YouTube"
                className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 hover:bg-paper hover:text-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 002.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 001.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 001.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8zM10 15V9l5.2 3L10 15z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-4 text-paper/90">Company</div>
            <ul className="space-y-3 text-sm text-paper/60">
              <li><Link href="/about-us" className="hover:text-paper transition-colors">About Us</Link></li>
              <li><Link href="/businesses" className="hover:text-paper transition-colors">Businesses</Link></li>
              <li><Link href="/profiles" className="hover:text-paper transition-colors">Profiles</Link></li>
              <li><Link href="/blog" className="hover:text-paper transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-paper transition-colors">Contact Us</Link></li>
              <li><Link href="/write-for-us" className="hover:text-paper transition-colors">Write for Us</Link></li>
              <li><Link href="/register" className="hover:text-paper transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium mb-4 text-paper/90">Services</div>
            <ul className="space-y-3 text-sm text-paper/60">
              <li><Link href="/services/recruitment-services" className="hover:text-paper transition-colors">Recruitment Services</Link></li>
              <li><Link href="/services/talent-acquisition" className="hover:text-paper transition-colors">Talent Acquisition</Link></li>
              <li><Link href="/services/business-growth-consultancy" className="hover:text-paper transition-colors">Business Growth Consultancy</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium mb-4 text-paper/90">Talent</div>
            <ul className="space-y-3 text-sm text-paper/60">
              <li><Link href="/hire-freelancers" className="hover:text-paper transition-colors">Hire Freelancers</Link></li>
              <li><Link href="/register" className="hover:text-paper transition-colors">Join as Freelancer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-paper/10 flex flex-col md:flex-row gap-4 md:items-center justify-between text-xs text-paper/40">
          <span>© {new Date().getFullYear()} Reflax. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-paper transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-paper transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
