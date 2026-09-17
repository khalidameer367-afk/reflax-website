"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/types";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";

export default function FreelancerForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/freelancers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line p-10 text-center">
        <h3 className="display text-2xl font-semibold text-ink">Application received</h3>
        <p className="mt-3 text-muted max-w-md mx-auto">
          Thanks for applying to Reflax. Our team will review your profile
          and email you once it&apos;s approved and live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Full name *</label>
          <input required name="full_name" className={inputCls} placeholder="Ayesha Khan" />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input required type="email" name="email" className={inputCls} placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Phone</label>
          <input name="phone" className={inputCls} placeholder="+92 3xx xxxxxxx" />
        </div>
        <div>
          <label className={labelCls}>Category *</label>
          <select required name="category" className={inputCls} defaultValue="">
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Professional title *</label>
        <input required name="title" className={inputCls} placeholder="Senior SEO Specialist" />
      </div>

      <div>
        <label className={labelCls}>About you *</label>
        <textarea required name="bio" rows={5} className={inputCls} placeholder="Tell us about your experience, the kind of work you do, and what makes you a good fit for clients..." />
      </div>

      <div>
        <label className={labelCls}>Skills (comma separated)</label>
        <input name="skills" className={inputCls} placeholder="Technical SEO, Link Building, Google Analytics" />
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label className={labelCls}>Years of experience</label>
          <input type="number" min="0" name="experience_years" className={inputCls} placeholder="5" />
        </div>
        <div>
          <label className={labelCls}>Rate</label>
          <input name="hourly_rate" className={inputCls} placeholder="$25/hr" />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input name="location" className={inputCls} placeholder="Lahore, Pakistan" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Portfolio URL</label>
          <input name="portfolio_url" className={inputCls} placeholder="https://" />
        </div>
        <div>
          <label className={labelCls}>LinkedIn URL</label>
          <input name="linkedin_url" className={inputCls} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Submit application"}
      </button>
      <p className="text-xs text-muted">
        Your profile will be reviewed before it appears publicly. We&apos;ll
        email you once it&apos;s approved.
      </p>
    </form>
  );
}
