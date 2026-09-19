"use client";

import { useRef, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import type { Freelancer } from "@/lib/types";
import { resizeImageToDataUrl } from "@/lib/image";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";

export default function FreelancerProfileFields({
  defaults,
  avatarPreview,
  onAvatarChange,
}: {
  defaults?: Partial<Freelancer>;
  avatarPreview: string | null;
  onAvatarChange: (dataUrl: string) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 400, 0.8);
      onAvatarChange(dataUrl);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
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
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors"
            >
              {processing ? "Processing..." : avatarPreview ? "Change photo" : "Upload photo"}
            </button>
            <p className="mt-2 text-xs text-muted">Optional. JPG or PNG, any size.</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Full name *</label>
          <input required name="full_name" defaultValue={defaults?.full_name} className={inputCls} placeholder="Ayesha Khan" />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input name="phone" defaultValue={defaults?.phone || ""} className={inputCls} placeholder="+92 3xx xxxxxxx" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Category *</label>
        <select required name="category" defaultValue={defaults?.category || ""} className={inputCls}>
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Professional title *</label>
        <input required name="title" defaultValue={defaults?.title} className={inputCls} placeholder="Senior SEO Specialist" />
      </div>

      <div>
        <label className={labelCls}>About you *</label>
        <textarea required name="bio" defaultValue={defaults?.bio} rows={5} className={inputCls} placeholder="Tell us about your experience, the kind of work you do, and what makes you a good fit for clients..." />
      </div>

      <div>
        <label className={labelCls}>Skills (comma separated)</label>
        <input name="skills" defaultValue={defaults?.skills?.join(", ")} className={inputCls} placeholder="Technical SEO, Link Building, Google Analytics" />
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label className={labelCls}>Years of experience</label>
          <input type="number" min="0" name="experience_years" defaultValue={defaults?.experience_years ?? ""} className={inputCls} placeholder="5" />
        </div>
        <div>
          <label className={labelCls}>Rate</label>
          <input name="hourly_rate" defaultValue={defaults?.hourly_rate || ""} className={inputCls} placeholder="$25/hr" />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input name="location" defaultValue={defaults?.location || ""} className={inputCls} placeholder="Lahore, Pakistan" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Portfolio URL</label>
          <input name="portfolio_url" defaultValue={defaults?.portfolio_url || ""} className={inputCls} placeholder="https://" />
        </div>
        <div>
          <label className={labelCls}>LinkedIn URL</label>
          <input name="linkedin_url" defaultValue={defaults?.linkedin_url || ""} className={inputCls} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>
    </>
  );
}
