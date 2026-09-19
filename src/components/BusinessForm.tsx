"use client";

import { useRef, useState } from "react";
import { resizeImageToDataUrl } from "@/lib/image";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";

export default function BusinessForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file, 500, 0.85);
    setLogoPreview(dataUrl);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (logoPreview) data.logo_url = logoPreview;

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      form.reset();
      setLogoPreview(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line p-10 text-center">
        <h3 className="display text-2xl font-semibold text-ink">Registration received</h3>
        <p className="mt-3 text-muted max-w-md mx-auto">
          Thanks for registering your business with Reflax. Our team will
          review it and email you once it&apos;s approved and listed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelCls}>Company logo</label>
        <div className="flex items-center gap-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-20 w-20 border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0"
          >
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Preview" className="h-full w-full object-contain" />
            ) : (
              <span className="text-xs text-muted text-center px-2">Add logo</span>
            )}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors"
            >
              {logoPreview ? "Change logo" : "Upload logo"}
            </button>
            <p className="mt-2 text-xs text-muted">Optional. JPG or PNG, any size.</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Company name *</label>
          <input required name="company_name" className={inputCls} placeholder="Acme Studios" />
        </div>
        <div>
          <label className={labelCls}>Contact person *</label>
          <input required name="contact_person" className={inputCls} placeholder="Bilal Ahmed" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Email *</label>
          <input required type="email" name="email" className={inputCls} placeholder="hello@company.com" />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input name="phone" className={inputCls} placeholder="+92 3xx xxxxxxx" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Industry *</label>
          <input required name="industry" className={inputCls} placeholder="E-commerce, Real Estate, IT..." />
        </div>
        <div>
          <label className={labelCls}>Company size</label>
          <select name="company_size" className={inputCls} defaultValue="">
            <option value="" disabled>Select</option>
            <option>1–10 employees</option>
            <option>11–50 employees</option>
            <option>51–200 employees</option>
            <option>200+ employees</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Website</label>
          <input name="website" className={inputCls} placeholder="https://" />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input name="location" className={inputCls} placeholder="Lahore, Pakistan" />
        </div>
      </div>

      <div>
        <label className={labelCls}>About your business *</label>
        <textarea required name="description" rows={8} className={inputCls} placeholder="What does your company do? What are you looking for on Reflax? (Feel free to write a full description — this shows on your public profile page.)" />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Register business"}
      </button>
      <p className="text-xs text-muted">
        Your listing will be reviewed before it goes live. We&apos;ll email
        you once it&apos;s approved.
      </p>
    </form>
  );
}
