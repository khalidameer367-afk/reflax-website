"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import type { Freelancer, Business, EntrepreneurProfile, BlogPost } from "@/lib/types";
import { resizeImageToDataUrl } from "@/lib/image";

const statusColor: Record<string, string> = {
  pending: "text-amber-600",
  approved: "text-green-600",
  rejected: "text-red-600",
};

const inputCls = "w-full border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-ink";

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"freelancers" | "businesses" | "profiles" | "blog">("freelancers");

  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [profiles, setProfiles] = useState<EntrepreneurProfile[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setAuthed(true);
    else setLoginError("Incorrect password.");
  }

  async function loadFreelancers() {
    const res = await fetch("/api/admin/freelancers");
    if (res.ok) setFreelancers((await res.json()).freelancers);
  }
  async function loadBusinesses() {
    const res = await fetch("/api/admin/pending");
    if (res.ok) setBusinesses((await res.json()).businesses);
  }
  async function loadProfiles() {
    const res = await fetch("/api/admin/profiles");
    if (res.ok) setProfiles((await res.json()).profiles);
  }
  async function loadPosts() {
    const res = await fetch("/api/admin/blog");
    if (res.ok) setPosts((await res.json()).posts);
  }

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadFreelancers(), loadBusinesses(), loadProfiles(), loadPosts()]);
    setLoading(false);
  }

  useEffect(() => {
    if (authed) loadAll();
  }, [authed]);

  async function reviewFreelancer(id: string, action: "approved" | "rejected") {
    await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "freelancer", id, action }),
    });
    loadFreelancers();
  }
  async function reviewBusiness(id: string, action: "approved" | "rejected") {
    await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "business", id, action }),
    });
    loadBusinesses();
  }
  async function deleteFreelancer(id: string) {
    if (!confirm("Remove this profile?")) return;
    await fetch("/api/admin/freelancers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadFreelancers();
  }
  async function deleteBusiness(id: string) {
    if (!confirm("Remove this business?")) return;
    await fetch("/api/admin/businesses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadBusinesses();
  }
  async function deleteProfile(id: string) {
    if (!confirm("Delete this profile?")) return;
    await fetch("/api/admin/profiles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadProfiles();
  }
  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadPosts();
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

      <div className="flex gap-6 border-b border-line mb-10 text-sm overflow-x-auto">
        {(["freelancers", "businesses", "profiles", "blog"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 -mb-px border-b-2 capitalize whitespace-nowrap transition-colors ${
              tab === t ? "border-ink text-ink font-medium" : "border-transparent text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted text-sm">Loading...</p>}

      {tab === "freelancers" && (
        <FreelancersTab
          freelancers={freelancers}
          onChanged={loadFreelancers}
          onDelete={deleteFreelancer}
          onReview={reviewFreelancer}
        />
      )}

      {tab === "businesses" && (
        <BusinessesTab
          businesses={businesses}
          onChanged={loadBusinesses}
          onDelete={deleteBusiness}
          onReview={reviewBusiness}
        />
      )}

      {tab === "profiles" && (
        <ProfilesTab profiles={profiles} onChanged={loadProfiles} onDelete={deleteProfile} />
      )}

      {tab === "blog" && (
        <BlogTab posts={posts} onChanged={loadPosts} onDelete={deletePost} />
      )}
    </div>
  );
}

/* ---------------- Freelancers ---------------- */

function FreelancersTab({
  freelancers,
  onChanged,
  onDelete,
  onReview,
}: {
  freelancers: Freelancer[];
  onChanged: () => void;
  onDelete: (id: string) => void;
  onReview: (id: string, action: "approved" | "rejected") => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {freelancers.length === 0 && <p className="text-muted text-sm">No profiles yet.</p>}
      {freelancers.map((f) =>
        editingId === f.id ? (
          <EditFreelancerForm
            key={f.id}
            freelancer={f}
            onCancel={() => setEditingId(null)}
            onSaved={() => { setEditingId(null); onChanged(); }}
          />
        ) : (
          <div key={f.id} className="border border-line p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-ink/5 border border-line flex items-center justify-center text-sm font-semibold text-ink overflow-hidden shrink-0">
                {f.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.avatar_url} alt={f.full_name} className="h-full w-full object-cover" />
                ) : (
                  f.full_name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{f.full_name}</span>
                  <span className={`text-xs font-medium uppercase ${statusColor[f.status]}`}>{f.status}</span>
                </div>
                <p className="text-sm text-muted mt-0.5">{f.title} · {f.category}</p>
                <p className="text-sm text-muted mt-0.5">{f.email}</p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0 flex-wrap">
              {f.status === "pending" && (
                <>
                  <button onClick={() => onReview(f.id, "approved")} className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-paper transition-colors">
                    Approve
                  </button>
                  <button onClick={() => onReview(f.id, "rejected")} className="border border-line px-4 py-2 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
                    Reject
                  </button>
                </>
              )}
              <button onClick={() => setEditingId(f.id)} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
                Edit
              </button>
              <button onClick={() => onDelete(f.id)} className="border border-line px-4 py-2 text-sm text-muted hover:text-red-600 hover:border-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function EditFreelancerForm({
  freelancer,
  onCancel,
  onSaved,
}: {
  freelancer: Freelancer;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(freelancer.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(await resizeImageToDataUrl(file, 400, 0.8));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    data.id = freelancer.id;
    if (avatarPreview) data.avatar_url = avatarPreview;
    await fetch("/api/admin/freelancers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink p-6 space-y-4">
      <div className="flex items-center gap-5">
        <div onClick={() => fileInputRef.current?.click()} className="h-16 w-16 rounded-full border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">Photo</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
          Change photo
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required name="full_name" defaultValue={freelancer.full_name} placeholder="Full name" className={inputCls} />
        <input required type="email" name="email" defaultValue={freelancer.email} placeholder="Email" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="phone" defaultValue={freelancer.phone || ""} placeholder="Phone" className={inputCls} />
        <select required name="category" defaultValue={freelancer.category} className={inputCls}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <input required name="title" defaultValue={freelancer.title} placeholder="Title" className={inputCls} />
      <textarea required name="bio" defaultValue={freelancer.bio} rows={4} placeholder="Bio" className={inputCls} />
      <input name="skills" defaultValue={freelancer.skills?.join(", ")} placeholder="Skills (comma separated)" className={inputCls} />
      <div className="grid sm:grid-cols-3 gap-4">
        <input type="number" name="experience_years" defaultValue={freelancer.experience_years ?? ""} placeholder="Years of experience" className={inputCls} />
        <input name="hourly_rate" defaultValue={freelancer.hourly_rate || ""} placeholder="Rate" className={inputCls} />
        <input name="location" defaultValue={freelancer.location || ""} placeholder="Location" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="portfolio_url" defaultValue={freelancer.portfolio_url || ""} placeholder="Portfolio URL" className={inputCls} />
        <input name="linkedin_url" defaultValue={freelancer.linkedin_url || ""} placeholder="LinkedIn URL" className={inputCls} />
      </div>
      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ---------------- Businesses ---------------- */

function BusinessesTab({
  businesses,
  onChanged,
  onDelete,
  onReview,
}: {
  businesses: Business[];
  onChanged: () => void;
  onDelete: (id: string) => void;
  onReview: (id: string, action: "approved" | "rejected") => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {businesses.length === 0 && <p className="text-muted text-sm">No registrations yet.</p>}
      {businesses.map((b) =>
        editingId === b.id ? (
          <EditBusinessForm
            key={b.id}
            business={b}
            onCancel={() => setEditingId(null)}
            onSaved={() => { setEditingId(null); onChanged(); }}
          />
        ) : (
          <div key={b.id} className="border border-line p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 border border-line bg-ink/5 flex items-center justify-center text-sm font-semibold text-ink overflow-hidden shrink-0">
                {b.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo_url} alt={b.company_name} className="h-full w-full object-contain" />
                ) : (
                  b.company_name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{b.company_name}</span>
                  <span className={`text-xs font-medium uppercase ${statusColor[b.status]}`}>{b.status}</span>
                </div>
                <p className="text-sm text-muted mt-0.5">{b.industry} · {b.contact_person}</p>
                <p className="text-sm text-muted mt-0.5">{b.email}</p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0 flex-wrap">
              {b.status === "pending" && (
                <>
                  <button onClick={() => onReview(b.id, "approved")} className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-paper transition-colors">
                    Approve
                  </button>
                  <button onClick={() => onReview(b.id, "rejected")} className="border border-line px-4 py-2 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
                    Reject
                  </button>
                </>
              )}
              <button onClick={() => setEditingId(b.id)} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
                Edit
              </button>
              <button onClick={() => onDelete(b.id)} className="border border-line px-4 py-2 text-sm text-muted hover:text-red-600 hover:border-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function EditBusinessForm({
  business,
  onCancel,
  onSaved,
}: {
  business: Business;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(business.logo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(await resizeImageToDataUrl(file, 500, 0.85));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    data.id = business.id;
    if (logoPreview) data.logo_url = logoPreview;
    await fetch("/api/admin/businesses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink p-6 space-y-4">
      <div className="flex items-center gap-5">
        <div onClick={() => fileInputRef.current?.click()} className="h-16 w-16 border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
          {logoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPreview} alt="Preview" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-muted">Logo</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
          Change logo
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required name="company_name" defaultValue={business.company_name} placeholder="Company name" className={inputCls} />
        <input required name="contact_person" defaultValue={business.contact_person} placeholder="Contact person" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required type="email" name="email" defaultValue={business.email} placeholder="Email" className={inputCls} />
        <input name="phone" defaultValue={business.phone || ""} placeholder="Phone" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required name="industry" defaultValue={business.industry} placeholder="Industry" className={inputCls} />
        <input name="company_size" defaultValue={business.company_size || ""} placeholder="Company size" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="website" defaultValue={business.website || ""} placeholder="Website" className={inputCls} />
        <input name="location" defaultValue={business.location || ""} placeholder="Location" className={inputCls} />
      </div>
      <textarea required name="description" defaultValue={business.description} rows={5} placeholder="Description" className={inputCls} />
      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ---------------- Profiles ---------------- */

function ProfilesTab({
  profiles,
  onChanged,
  onDelete,
}: {
  profiles: EntrepreneurProfile[];
  onChanged: () => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(await resizeImageToDataUrl(file, 400, 0.8));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (avatarPreview) data.avatar_url = avatarPreview;
    await fetch("/api/admin/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);
    setShowForm(false);
    setAvatarPreview(null);
    e.currentTarget.reset();
    onChanged();
  }

  return (
    <div>
      <button
        onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
        className="mb-8 border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
      >
        {showForm ? "Cancel" : "+ Add profile"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-line p-6 mb-10 space-y-4 max-w-lg">
          <div className="flex items-center gap-5">
            <div onClick={() => fileInputRef.current?.click()} className="h-16 w-16 rounded-full border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-muted">Photo</span>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
              Upload photo
            </button>
          </div>
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
        {profiles.map((p) =>
          editingId === p.id ? (
            <EditProfileForm
              key={p.id}
              profile={p}
              onCancel={() => setEditingId(null)}
              onSaved={() => { setEditingId(null); onChanged(); }}
            />
          ) : (
            <div key={p.id} className="border border-line p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-ink/5 border border-line flex items-center justify-center text-sm font-semibold text-ink overflow-hidden shrink-0">
                  {p.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.avatar_url} alt={p.full_name} className="h-full w-full object-cover" />
                  ) : (
                    p.full_name.charAt(0)
                  )}
                </div>
                <div>
                  <span className="font-medium text-ink">{p.full_name}</span>
                  <span className="text-sm text-muted ml-2">{p.title} · {p.category}</span>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => { setEditingId(p.id); setShowForm(false); }} className="text-sm text-muted hover:text-ink transition-colors">
                  Edit
                </button>
                <button onClick={() => onDelete(p.id)} className="text-sm text-muted hover:text-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EditProfileForm({
  profile,
  onCancel,
  onSaved,
}: {
  profile: EntrepreneurProfile;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(await resizeImageToDataUrl(file, 400, 0.8));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    data.id = profile.id;
    if (avatarPreview) data.avatar_url = avatarPreview;
    await fetch("/api/admin/profiles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink p-6 space-y-4">
      <div className="flex items-center gap-5">
        <div onClick={() => fileInputRef.current?.click()} className="h-16 w-16 rounded-full border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">Photo</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
          Change photo
        </button>
      </div>
      <input required name="full_name" defaultValue={profile.full_name} placeholder="Full name" className={inputCls} />
      <select required name="category" defaultValue={profile.category} className={inputCls}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input required name="title" defaultValue={profile.title} placeholder="Title" className={inputCls} />
      <input name="company_name" defaultValue={profile.company_name || ""} placeholder="Company name" className={inputCls} />
      <textarea required name="bio" defaultValue={profile.bio} rows={3} placeholder="Bio" className={inputCls} />
      <input name="location" defaultValue={profile.location || ""} placeholder="Location" className={inputCls} />
      <input name="website" defaultValue={profile.website || ""} placeholder="Website URL" className={inputCls} />
      <input name="linkedin_url" defaultValue={profile.linkedin_url || ""} placeholder="LinkedIn URL" className={inputCls} />
      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ---------------- Blog ---------------- */

function BlogTab({
  posts,
  onChanged,
  onDelete,
}: {
  posts: BlogPost[];
  onChanged: () => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <button
        onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
        className="mb-8 border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
      >
        {showForm ? "Cancel" : "+ New post"}
      </button>

      {showForm && (
        <BlogPostForm
          onCancel={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); onChanged(); }}
        />
      )}

      <div className="space-y-3">
        {posts.length === 0 && <p className="text-muted text-sm">No posts yet.</p>}
        {posts.map((post) =>
          editingId === post.id ? (
            <BlogPostForm
              key={post.id}
              post={post}
              onCancel={() => setEditingId(null)}
              onSaved={() => { setEditingId(null); onChanged(); }}
            />
          ) : (
            <div key={post.id} className="border border-line p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {post.featured_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.featured_image_url} alt={post.title} className="h-12 w-12 object-cover shrink-0" />
                ) : (
                  <div className="h-12 w-12 bg-ink/5 shrink-0" />
                )}
                <div>
                  <span className="font-medium text-ink">{post.title}</span>
                  <p className="text-xs text-muted mt-0.5">/blog/{post.slug}</p>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => { setEditingId(post.id); setShowForm(false); }} className="text-sm text-muted hover:text-ink transition-colors">
                  Edit
                </button>
                <button onClick={() => onDelete(post.id)} className="text-sm text-muted hover:text-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function BlogPostForm({
  post,
  onCancel,
  onSaved,
}: {
  post?: BlogPost;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.featured_image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(await resizeImageToDataUrl(file, 1200, 0.85));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (imagePreview) data.featured_image_url = imagePreview;

    if (post) {
      data.id = post.id;
      await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line p-6 mb-10 space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Featured image</label>
        <div className="flex items-center gap-5">
          <div onClick={() => fileInputRef.current?.click()} className="h-20 w-32 border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-muted text-center px-2">Add image</span>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
            {imagePreview ? "Change image" : "Upload image"}
          </button>
        </div>
      </div>
      <input required name="title" defaultValue={post?.title} placeholder="Post title" className={inputCls} />
      <input name="author" defaultValue={post?.author || ""} placeholder="Author name (optional)" className={inputCls} />
      <textarea name="excerpt" defaultValue={post?.excerpt || ""} rows={2} placeholder="Short excerpt (shown in listing)" className={inputCls} />
      <textarea required name="content" defaultValue={post?.content} rows={12} placeholder="Full post content" className={inputCls} />
      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : post ? "Save changes" : "Publish post"}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
