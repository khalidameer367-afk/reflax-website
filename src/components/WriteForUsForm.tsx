"use client";

import { useState } from "react";
import { CONTRIBUTOR_NICHES } from "@/lib/types";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";
const MAX_BYTES = 4 * 1024 * 1024;

export default function WriteForUsForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);

    const file = data.get("file");
    if (file instanceof File && file.size > MAX_BYTES) {
      setStatus("error");
      setErrorMsg("The file is too large. Please keep it under 4 MB.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/write-for-us", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      form.reset();
      setFileName("");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line p-8 max-w-xl">
        <h3 className="display text-xl font-semibold text-ink">Thank you!</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          We received your article. Our team will review it and get back to you by email if it is a good fit.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium underline underline-offset-4 text-ink"
        >
          Submit another article
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {/* Hidden trap field for spam bots */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className={labelCls}>Name *</label>
        <input required name="name" maxLength={100} className={inputCls} placeholder="Your full name" />
      </div>

      <div>
        <label className={labelCls}>Email *</label>
        <input required type="email" name="email" maxLength={150} className={inputCls} placeholder="you@example.com" />
      </div>

      <div>
        <label className={labelCls}>Niche *</label>
        <select required name="niche" defaultValue="" className={inputCls}>
          <option value="" disabled>Choose a niche</option>
          {CONTRIBUTOR_NICHES.map((n) => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Your article (file) *</label>
        <label className="flex items-center justify-between gap-4 border border-dashed border-line px-4 py-4 cursor-pointer hover:border-ink transition-colors">
          <span className="text-sm text-muted truncate">{fileName || "Choose a file (.docx, .doc, .pdf, .txt) — max 4 MB"}</span>
          <span className="shrink-0 border border-line px-3 py-1.5 text-sm text-ink">Browse</span>
          <input
            required
            type="file"
            name="file"
            accept=".doc,.docx,.pdf,.txt,.rtf,.odt"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            className="sr-only"
          />
        </label>
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center border border-accent bg-accent px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink hover:text-paper transition-colors disabled:opacity-50 hover:border-ink"
      >
        {status === "submitting" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
