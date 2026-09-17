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
          </div>

          <div>
            <div className="text-sm font-medium mb-4 text-paper/90">Company</div>
            <ul className="space-y-3 text-sm text-paper/60">
              <li><Link href="/about-us" className="hover:text-paper transition-colors">About Us</Link></li>
              <li><Link href="/businesses" className="hover:text-paper transition-colors">Businesses</Link></li>
              <li><Link href="/profiles" className="hover:text-paper transition-colors">Profiles</Link></li>
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

        <div className="mt-16 pt-8 border-t border-paper/10 flex flex-col md:flex-row gap-4 justify-between text-xs text-paper/40">
          <span>© {new Date().getFullYear()} Reflax. All rights reserved.</span>
          <span>Built for businesses, freelancers &amp; growth.</span>
        </div>
      </div>
    </footer>
  );
}
