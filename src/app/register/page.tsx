"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FreelancerProfileFields from "@/components/FreelancerProfileFields";
import { parseFreelancerFormData } from "@/lib/formHelpers";

const inputCls =
  "w-full border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors bg-paper";
const labelCls = "block text-sm font-medium text-ink mb-2";

export default function RegisterPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 1. Create the account.
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) {
        throw new Error(
          "Account created — please check your email to confirm it, then log in and finish your profile from your dashboard."
        );
      }

      // 2. Create the profile, linked to this account, live immediately.
      const profileFields = parseFreelancerFormData(form);
      const { error: insertError } = await supabase.from("freelancers").insert({
        ...profileFields,
        email,
        avatar_url: avatarPreview,
        user_id: userId,
        status: "approved",
      });
      if (insertError) throw insertError;

      // 3. Notify admin (informational, non-blocking).
      fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: profileFields.full_name, category: profileFields.category }),
      }).catch(() => {});

      router.push("/dashboard");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <div className="text-sm text-muted mb-5">Join Reflax</div>
          <h1 className="display text-[2.2rem] md:text-5xl font-semibold leading-[1.1] tracking-tight text-ink max-w-xl">
            Create your account &amp; profile.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted max-w-lg">
            Your profile goes live immediately. You can log in any time
            afterwards to edit or remove it from your dashboard.
          </p>
          <p className="mt-3 text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 font-medium text-ink">
              Log in
            </Link>
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Email *</label>
              <input required type="email" name="email" className={inputCls} placeholder="you@example.com" />
            </div>
            <div>
              <label className={labelCls}>Password *</label>
              <input required type="password" name="password" minLength={6} className={inputCls} placeholder="At least 6 characters" />
            </div>
          </div>

          <FreelancerProfileFields avatarPreview={avatarPreview} onAvatarChange={setAvatarPreview} />

          {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? "Creating..." : "Create account & publish profile"}
          </button>
        </form>
      </section>
    </div>
  );
}
