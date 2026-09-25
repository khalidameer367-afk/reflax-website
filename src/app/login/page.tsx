"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="container-x py-20 md:py-28 max-w-md mx-auto">
      <h1 className="display text-3xl font-semibold text-ink mb-2">Log in</h1>
      <p className="text-muted mb-8 text-sm">
        Access your dashboard to edit or remove your freelancer profile.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={inputCls}
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={inputCls}
        />
        {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
        <button
          disabled={status === "submitting"}
          className="w-full bg-ink text-paper py-3.5 text-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Don&apos;t have a profile yet?{" "}
        <Link href="/register" className="underline underline-offset-4 font-medium text-ink">
          Create one
        </Link>
      </p>
    </div>
  );
}
