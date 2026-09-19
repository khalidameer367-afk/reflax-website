"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Freelancer } from "@/lib/types";
import FreelancerProfileFields from "@/components/FreelancerProfileFields";
import { parseFreelancerFormData } from "@/lib/formHelpers";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Freelancer | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      const { data: freelancer } = await supabase
        .from("freelancers")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (freelancer) {
        setProfile(freelancer);
        setAvatarPreview(freelancer.avatar_url);
      }
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");

    const fields = parseFreelancerFormData(e.currentTarget);

    if (profile) {
      const { error } = await supabase
        .from("freelancers")
        .update({ ...fields, avatar_url: avatarPreview })
        .eq("id", profile.id);
      if (error) {
        setMessage("Something went wrong: " + error.message);
      } else {
        setMessage("Profile updated.");
      }
    } else {
      const { data, error } = await supabase
        .from("freelancers")
        .insert({
          ...fields,
          email: user.email,
          avatar_url: avatarPreview,
          user_id: user.id,
          status: "approved",
        })
        .select()
        .single();
      if (error) {
        setMessage("Something went wrong: " + error.message);
      } else {
        setProfile(data);
        setMessage("Profile published.");
      }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!profile) return;
    if (!confirm("Remove your profile from Reflax? This can't be undone.")) return;
    await supabase.from("freelancers").delete().eq("id", profile.id);
    setProfile(null);
    setAvatarPreview(null);
    setMessage("Your profile has been removed.");
  }

  if (loading) {
    return <div className="container-x py-24 text-muted">Loading...</div>;
  }

  return (
    <div className="container-x py-16 md:py-20 max-w-2xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="display text-3xl font-semibold text-ink">Your dashboard</h1>
        <button onClick={handleLogout} className="text-sm text-muted hover:text-ink underline underline-offset-4">
          Log out
        </button>
      </div>
      <p className="text-muted text-sm mb-10">{user?.email}</p>

      {!profile && (
        <p className="text-muted text-sm mb-6">
          You don&apos;t have a profile yet — fill this in to publish one.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FreelancerProfileFields defaults={profile || undefined} avatarPreview={avatarPreview} onAvatarChange={setAvatarPreview} />

        {message && <p className="text-sm text-ink">{message}</p>}

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-ink/85 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : profile ? "Save changes" : "Publish profile"}
          </button>
          {profile && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center border border-line px-7 py-3.5 text-sm font-medium text-muted hover:text-red-600 hover:border-red-600 transition-colors"
            >
              Delete my profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
