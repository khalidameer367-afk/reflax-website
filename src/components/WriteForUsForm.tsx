"use client";

import { useState } from "react";
import { CONTRIBUTOR_NICHES } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const EMAIL_LIMIT = 4 * 1024 * 1024; // up to 4 MB is sent as an email attachment, bigger files go through storage
const MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  rtf: "application/rtf",
  odt: "application/vnd.oasis.opendocument.text",
};

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
      setErrorMsg("The file is too large. Please keep it under 25 MB.");
      return;
    }

    setStatus("submitting");
    try {
      if (file instanceof File && file.size > EMAIL_LIMIT) {
        // Large file: upload straight to storage, then tell the server where it is.
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        if (!MIME[ext]) throw new Error("Please upload a .doc, .docx, .pdf, .txt, .rtf or .odt file.");
        const safe = file.name.replace(/[^\w.\- ]+/g, "_").replace(/\s+/g, "_").slice(0, 80);
        const path = `submissions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
        const { error: upErr } = await supabase.storage
          .from("guest-posts")
          .upload(path, file, { contentType: MIME[ext], upsert: false });
        if (upErr) throw new Error("Upload failed. Please try again, or use a smaller file.");

        const res = await fetch("/api/write-for-us/large", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            niche: data.get("niche"),
            website: data.get("website"),
            path,
            filename: file.name,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      } else {
        const res = await fetch("/api/write-for-us", { method: "POST", body: data });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      }
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
          <span className="text-sm text-muted truncate">{fileName || "Choose a file (.docx, .doc, .pdf, .txt) — max 25 MB"}</span>
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
        <p className="mt-2 text-xs text-muted">Document limit: 25 MB. Accepted: .docx, .doc, .pdf, .txt, .rtf, .odt</p>
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
