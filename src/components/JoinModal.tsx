"use client";

import Link from "next/link";
import { useEffect } from "react";

export const JOIN_OPTIONS = [
  {
    title: "Join as Freelancer",
    desc: "Create your account and freelancer profile so businesses can hire you.",
    href: "/register",
    color: "#37766E",
  },
  {
    title: "Join as Professional Profile",
    desc: "List yourself as an entrepreneur, founder or industry professional.",
    href: "/join/professional",
    color: "#2F5D9E",
  },
  {
    title: "Join as a Business",
    desc: "Add your company to the Reflax business directory.",
    href: "/join/business",
    color: "#C2692B",
  },
];

export default function JoinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Join Reflax"
    >
      <div className="relative w-full max-w-lg bg-paper border border-line p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-2xl leading-none text-muted hover:text-ink"
        >
          ×
        </button>
        <h2 className="display text-2xl font-semibold text-ink">Join Reflax</h2>
        <p className="mt-2 text-sm text-muted">Choose how you would like to join.</p>
        <div className="mt-6 space-y-3">
          {JOIN_OPTIONS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              onClick={onClose}
              style={{ backgroundColor: o.color }}
              className="block p-4 text-white transition hover:brightness-110 hover:-translate-y-0.5"
            >
              <div className="font-semibold">{o.title}</div>
              <div className="mt-1 text-sm text-white/85">{o.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
