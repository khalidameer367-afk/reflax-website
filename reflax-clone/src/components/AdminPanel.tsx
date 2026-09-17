"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import type { Freelancer, Business, EntrepreneurProfile } from "@/lib/types";

const statusColor: Record<string, string> = {
  pending: "text-amber-600",
  approved: "text-green-600",
  rejected: "text-red-600",
};

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"freelancers" | "businesses" | "profiles">("freelancers");

  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [profiles, setProfiles] = useState<EntrepreneurProfile[]>([]);
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError("Incorrect password.");
    }
  }

  async function loadPending() {
    setLoading(true);
    const res = await fetch("/api/admin/pending");
    if (res.ok) {
      const json = await res.json();
      setFreelancers(json.freelancers);
      setBusinesses(json.businesses);
    }
    setLoading(false);
  }

  async function loadProfiles() {
    const res = await fetch("/api/admin/profiles");
    if (res.ok) {
      const json = await res.json();
      setProfiles(json.profiles);
    }
  }

  useEffect(() => {
    if (authed) {
      loadPending();
      loadProfiles();
    }
  }, [authed]);

  async function review(type: "freelancer" | "business", id: string, action: "approved" | "rejected") {
    await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, action }),
    });
    loadPending();
  }

  async function deleteProfile(id: string) {
    await fetch("/api/admin/profiles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadProfiles();
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto py-24">
        <h1 className="display text-2xl font-semibold text-ink mb-6">Admin login</h1>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full border border-line px-4 py-3 text-[15px] focus:outline-none focus:border-ink"
          />
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button className="w-full bg-ink text-paper py-3 text-sm font-medium hover:bg-ink/85 transition-colors">
            Log in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-16">
      <h1 className="display text-3xl font-semibold text-ink mb-8">Admin panel</h1>

      <div className="flex gap-6 border-b border-line mb-10 text-sm">
        {(["freelancers", "businesses", "profiles"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 -mb-px border-b-2 capitalize transition-colors ${
              tab === t ? "border-ink text-ink font-medium" : "border-transparent text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted text-sm">Loading...</p>}

      {tab === "freelancers" && (
        <div className="space-y-4">
          {freelancers.length === 0 && <p className="text-muted text-sm">No applications yet.</p>}
          {freelancers.map((f) => (
            <div key={f.id} className="border border-line p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-ink">{f.full_name}</span>
                  <span className={`text-xs font-medium uppercase ${statusColor[f.status]}`}>{f.status}</span>
                </div>
                <p className="text-sm text-muted mt-1">{f.title} · {f.category}</p>
                <p className="text-sm text-muted mt-1">{f.email}</p>
              </div>
              {f.status === "pending" && (
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => review("freelancer", f.id, "approved")} className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-paper transition-colors">
                    Approve
                  </button>
                  <button onClick={() => review("freelancer", f.id, "rejected")} className="border border-line px-4 py-2 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "businesses" && (
        <div className="space-y-4">
          {businesses.length === 0 && <p className="text-muted text-sm">No registrations yet.</p>}
          {businesses.map((b) => (
            <div key={b.id} className="border border-line p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-ink">{b.company_name}</span>
                  <span className={`text-xs font-medium uppercase ${statusColor[b.status]}`}>{b.status}</span>
                </div>
                <p className="text-sm text-muted mt-1">{b.industry} · {b.contact_person}</p>
                <p className="text-sm text-muted mt-1">{b.email}</p>
              </div>
              {b.status === "pending" && (
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => review("business", b.id, "approved")} className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-paper transition-colors">
                    Approve
                  </button>
                  <button onClick={() => review("business", b.id, "rejected")} className="border border-line px-4 py-2 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "profiles" && (
        <ProfilesTab profiles={profiles} onAdded={loadProfiles} onDelete={deleteProfile} />
      )}
    </div>
  );
}

function ProfilesTab({
  profiles,
  onAdded,
  onDelete,
}: {
  profiles: EntrepreneurProfile[];
  onAdded: () => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    await fetch("/api/admin/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);
    setShowForm(false);
    e.currentTarget.reset();
    onAdded();
  }

  const inputCls = "w-full border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-ink";

  return (
    <div>
      <button
        onClick={() => setShowForm((v) => !v)}
        className="mb-8 border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
      >
        {showForm ? "Cancel" : "+ Add profile"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-line p-6 mb-10 space-y-4 max-w-lg">
          <input required name="full_name" placeholder="Full name" className={inputCls} />
          <select required name="category" className={inputCls} defaultValue="">
            <option value="" disabled>Category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input required name="title" placeholder="Title (e.g. Founder & CEO)" className={inputCls} />
          <input name="company_name" placeholder="Company name" className={inputCls} />
          <textarea required name="bio" rows={3} placeholder="Short bio" className={inputCls} />
          <input name="location" placeholder="Location" className={inputCls} />
          <input name="website" placeholder="Website URL" className={inputCls} />
          <input name="linkedin_url" placeholder="LinkedIn URL" className={inputCls} />
          <button disabled={submitting} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
            {submitting ? "Adding..." : "Add profile"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {profiles.length === 0 && <p className="text-muted text-sm">No profiles added yet.</p>}
        {profiles.map((p) => (
          <div key={p.id} className="border border-line p-5 flex items-center justify-between">
            <div>
              <span className="font-medium text-ink">{p.full_name}</span>
              <span className="text-sm text-muted ml-2">{p.title} · {p.category}</span>
            </div>
            <button onClick={() => onDelete(p.id)} className="text-sm text-muted hover:text-red-600 transition-colors">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
