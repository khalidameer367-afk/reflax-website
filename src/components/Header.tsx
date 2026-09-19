"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SERVICES = [
  { label: "Recruitment Services", href: "/services/recruitment-services" },
  { label: "Talent Acquisition", href: "/services/talent-acquisition" },
  { label: "Business Growth Consultancy", href: "/services/business-growth-consultancy" },
];

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Hire Freelancers", href: "/hire-freelancers" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-black.webp"
            alt="Reflax"
            width={140}
            height={50}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-ink ${
                isActive(item.href) ? "text-ink" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={`flex items-center gap-1 transition-colors hover:text-ink ${
                pathname.startsWith("/services") ? "text-ink" : "text-muted"
              }`}
            >
              Services
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full w-72 border border-line bg-paper pt-1 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-5 py-3 text-sm text-ink hover:bg-ink hover:text-paper transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/businesses"
            className={`transition-colors hover:text-ink ${
              isActive("/businesses") ? "text-ink" : "text-muted"
            }`}
          >
            Businesses
          </Link>
          <Link
            href="/profiles"
            className={`transition-colors hover:text-ink ${
              isActive("/profiles") ? "text-ink" : "text-muted"
            }`}
          >
            Profiles
          </Link>
        </nav>

        <div className="hidden lg:block">
          <Link
            href={loggedIn ? "/dashboard" : "/register"}
            className="inline-flex items-center border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {loggedIn ? "My Dashboard" : "Register"}
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-[1.5px] w-6 bg-ink transition-transform ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[1.5px] w-6 bg-ink transition-transform ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-paper">
          <div className="container-x flex flex-col py-4 text-[15px]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-line/70 text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="py-3 border-b border-line/70">
              <div className="mb-2 text-muted">Services</div>
              <div className="flex flex-col gap-2 pl-3">
                {SERVICES.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setOpen(false)} className="text-ink">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/businesses" onClick={() => setOpen(false)} className="py-3 border-b border-line/70 text-ink">
              Businesses
            </Link>
            <Link href="/profiles" onClick={() => setOpen(false)} className="py-3 border-b border-line/70 text-ink">
              Profiles
            </Link>
            <Link
              href={loggedIn ? "/dashboard" : "/register"}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center border border-ink px-5 py-3 text-sm font-medium text-ink"
            >
              {loggedIn ? "My Dashboard" : "Register"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
