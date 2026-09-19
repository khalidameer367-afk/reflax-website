import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export const metadata = { title: "Hire Freelancers — Reflax" };

function slugify(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function HireFreelancers() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-24">
          <div className="text-sm text-muted mb-5">Hire freelancers</div>
          <h1 className="display text-[2.4rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-2xl">
            Browse verified freelancers by category.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-xl">
            Every profile is reviewed before it goes live. Pick a category to
            see approved professionals ready to work.
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-line border border-line">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/hire-freelancers/${slugify(cat)}`}
              className="group bg-paper p-8 flex flex-col justify-between min-h-[140px] hover:bg-ink transition-colors"
            >
              <span className="text-lg font-medium text-ink group-hover:text-paper transition-colors">
                {cat}
              </span>
              <span className="text-sm text-muted group-hover:text-paper/70 transition-colors">
                View freelancers →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
