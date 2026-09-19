"use client";

import { useRef, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import { resizeImageToDataUrl } from "@/lib/image";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";

export default function FreelancerForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarProcessing, setAvatarProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarProcessing(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 400, 0.8);
      setAvatarPreview(dataUrl);
    } catch {
      setErrorMsg("Couldn't process that image. Try a different photo.");
    } finally {
      setAvatarProcessing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (avatarPreview) {
      (data as Record<string, string>).avatar_url = avatarPreview;
    }

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
      setAvatarPreview(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line p-10 text-center">
        <h3 className="display text-2xl font-semibold text-ink">You&apos;re live!</h3>
        <p className="mt-3 text-muted max-w-md mx-auto">
          Your profile has been added to Reflax and is visible right now
          under your category.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelCls}>Profile photo</label>
        <div className="flex items-center gap-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-20 w-20 rounded-full border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0"
          >
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-muted text-center px-2">Add photo</span>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors"
            >
              {avatarProcessing ? "Processing..." : avatarPreview ? "Change photo" : "Upload photo"}
            </button>
            <p className="mt-2 text-xs text-muted">Optional. JPG or PNG, any size.</p>
          </div>
        </div>
      </div>

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
        disabled={status === "submitting" || avatarProcessing}
        className="inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Publish my profile"}
      </button>
      <p className="text-xs text-muted">
        Your profile goes live immediately after submitting.
      </p>
    </form>
  );
}
