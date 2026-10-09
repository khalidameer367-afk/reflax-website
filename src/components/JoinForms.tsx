"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import { resizeImageToDataUrl } from "@/lib/image";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";
const btnCls =
  "inline-flex items-center border border-accent bg-accent px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink hover:text-paper transition-colors disabled:opacity-50 hover:border-ink";

function SuccessBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-line p-8 max-w-xl">
      <h3 className="display text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium underline underline-offset-4 text-ink">
        Back to home
      </Link>
    </div>
  );
}

function ImagePicker({
  label,
  preview,
  onChange,
  round,
}: {
  label: string;
  preview: string | null;
  onChange: (dataUrl: string) => void;
  round?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(await resizeImageToDataUrl(file, 500, 0.85));
  }
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-5">
        <div
          onClick={() => ref.current?.click()}
          className={`h-20 w-20 border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0 ${round ? "rounded-full" : ""}`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">Add</span>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" />
        <button type="button" onClick={() => ref.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
          {preview ? "Change" : "Upload"}
        </button>
      </div>
    </div>
  );
}

async function submitJoin(payload: Record<string, unknown>) {
  const res = await fetch("/api/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
}

/* ------------------------- Professional profile ------------------------- */

export function ProfessionalJoinForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      await submitJoin({ ...data, type: "professional", avatar_url: avatar });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <SuccessBox
        title="Profile submitted!"
        text="Thank you. Our team will review your profile and publish it once it is approved."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website_confirm" tabIndex={-1} autoComplete="off" />
      </div>

      <ImagePicker label="Profile photo" preview={avatar} onChange={setAvatar} round />

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Full name *</label>
          <input required name="full_name" maxLength={100} className={inputCls} placeholder="Your full name" />
        </div>
        <div>
          <label className={labelCls}>Title *</label>
          <input required name="title" maxLength={150} className={inputCls} placeholder="e.g. Founder & CEO" />
        </div>
        <div>
          <label className={labelCls}>Email * <span className="text-muted font-normal">(shown on your profile)</span></label>
          <input required type="email" name="email" maxLength={150} className={inputCls} placeholder="you@example.com" />
        </div>
        <div>
          <label className={labelCls}>Phone number <span className="text-muted font-normal">(shown on your profile)</span></label>
          <input name="phone" maxLength={40} className={inputCls} placeholder="Optional" />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input name="company_name" maxLength={150} className={inputCls} placeholder="Optional" />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select name="category" defaultValue="" className={inputCls}>
            <option value="">No category (optional)</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input name="location" maxLength={150} className={inputCls} placeholder="City, Country" />
        </div>
        <div>
          <label className={labelCls}>Website</label>
          <input name="website" maxLength={300} className={inputCls} placeholder="https://" />
        </div>
      </div>

      <div>
        <label className={labelCls}>LinkedIn URL</label>
        <input name="linkedin_url" maxLength={300} className={inputCls} placeholder="https://linkedin.com/in/..." />
      </div>

      <div>
        <label className={labelCls}>About you *</label>
        <textarea required name="bio" rows={7} maxLength={6000} className={inputCls} placeholder="Tell us about your experience, work and achievements." />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={status === "submitting"} className={btnCls}>
        {status === "submitting" ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
}

/* ------------------------------- Business ------------------------------- */

export function BusinessJoinForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      await submitJoin({ ...data, type: "business", logo_url: logo });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <SuccessBox
        title="Business submitted!"
        text="Thank you. Our team will review your business and publish it once it is approved."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website_confirm" tabIndex={-1} autoComplete="off" />
      </div>

      <ImagePicker label="Company logo" preview={logo} onChange={setLogo} />

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Company name *</label>
          <input required name="company_name" maxLength={150} className={inputCls} placeholder="Your company" />
        </div>
        <div>
          <label className={labelCls}>Contact person *</label>
          <input required name="contact_person" maxLength={100} className={inputCls} placeholder="Full name" />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input required type="email" name="email" maxLength={150} className={inputCls} placeholder="you@company.com" />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input name="phone" maxLength={40} className={inputCls} placeholder="Optional" />
        </div>
        <div>
          <label className={labelCls}>Industry *</label>
          <input required name="industry" maxLength={120} className={inputCls} placeholder="e.g. Software, Retail" />
        </div>
        <div>
          <label className={labelCls}>Company size</label>
          <input name="company_size" maxLength={60} className={inputCls} placeholder="e.g. 11-50" />
        </div>
        <div>
          <label className={labelCls}>Website</label>
          <input name="website" maxLength={300} className={inputCls} placeholder="https://" />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input name="location" maxLength={150} className={inputCls} placeholder="City, Country" />
        </div>
      </div>

      <div>
        <label className={labelCls}>About your business *</label>
        <textarea required name="description" rows={7} maxLength={6000} className={inputCls} placeholder="What does your business do?" />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={status === "submitting"} className={btnCls}>
        {status === "submitting" ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
}
