"use client";

import { useState } from "react";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
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

  return (
    <section className="container-x py-16 md:py-20 max-w-xl">
      {status === "success" ? (
        <div className="border border-line p-10 text-center">
          <h3 className="display text-2xl font-semibold text-ink">Message sent</h3>
          <p className="mt-3 text-muted">
            Thanks for reaching out — we&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Name *</label>
              <input required name="name" className={inputCls} placeholder="Your name" />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input required type="email" name="email" className={inputCls} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Subject</label>
            <input name="subject" className={inputCls} placeholder="What's this about?" />
          </div>
          <div>
            <label className={labelCls}>Message *</label>
            <textarea required name="message" rows={6} className={inputCls} placeholder="Tell us how we can help..." />
          </div>
          {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </section>
  );
}
