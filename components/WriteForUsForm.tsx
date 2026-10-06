"use client";

import { useState } from "react";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";

export const WRITE_TOPICS = [
  "Technology",
  "Education",
  "Business",
  "AI",
  "Digital Marketing",
];

export default function WriteForUsForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const message = [
      `Topic: ${d.topic}`,
      `Article title / idea: ${d.title}`,
      `LinkedIn / website: ${d.profile}`,
      `Published samples: ${d.samples || "—"}`,
      "",
      d.message || "",
    ].join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name,
          email: d.email,
          subject: `Write for Us pitch: ${d.topic}`,
          message,
        }),
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
      <div className="border border-line p-10">
        <h3 className="display text-2xl font-semibold text-ink">Pitch received</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted max-w-md">
          Thanks for your submission. Our editorial team reviews every pitch and
          will reply only if your idea is a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Full name *</label>
          <input required name="name" className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input required type="email" name="email" className={inputCls} placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>LinkedIn or website *</label>
          <input required name="profile" className={inputCls} placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label className={labelCls}>Topic *</label>
          <select required name="topic" defaultValue="" className={inputCls}>
            <option value="" disabled>Select a topic</option>
            {WRITE_TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Article title or idea *</label>
        <input required name="title" className={inputCls} placeholder="e.g. How AI search is changing SEO in 2026" />
      </div>

      <div>
        <label className={labelCls}>Links to previously published work</label>
        <input name="samples" className={inputCls} placeholder="Paste one or two links" />
      </div>

      <div>
        <label className={labelCls}>Short outline or note *</label>
        <textarea
          required
          name="message"
          rows={6}
          className={inputCls}
          placeholder="Summarise what the article will cover and what the reader will learn..."
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center border border-accent bg-accent px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink hover:text-paper transition-colors disabled:opacity-50 hover:border-ink"
      >
        {status === "submitting" ? "Sending..." : "Submit your pitch"}
      </button>
    </form>
  );
}
