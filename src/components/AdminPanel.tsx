"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/types";
import type { Freelancer, Business, EntrepreneurProfile, BlogPost, PageSeo, PageContentRow, Redirect } from "@/lib/types";
import { resizeImageToDataUrl } from "@/lib/image";
import RichTextEditor from "@/components/RichTextEditor";
import SeoFieldsSection from "@/components/SeoFieldsSection";
import SlugField from "@/components/SlugField";
import { PAGE_KEYS } from "@/lib/pageSeo";

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
  const [tab, setTab] = useState<"freelancers" | "businesses" | "profiles" | "blog" | "pages" | "redirects">("freelancers");

  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [profiles, setProfiles] = useState<EntrepreneurProfile[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [redirects, setRedirects] = useState<Redirect[]>([]);
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
  async function loadRedirects() {
    const res = await fetch("/api/admin/redirects");
    if (res.ok) setRedirects((await res.json()).redirects);
  }

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadFreelancers(), loadBusinesses(), loadProfiles(), loadPosts(), loadRedirects()]);
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
  async function deleteRedirect(id: string) {
    if (!confirm("Delete this redirect?")) return;
    await fetch("/api/admin/redirects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadRedirects();
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
        {(["freelancers", "businesses", "profiles", "blog", "pages", "redirects"] as const).map((t) => (
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

      {tab === "pages" && <PagesTab />}

      {tab === "redirects" && (
        <RedirectsTab redirects={redirects} onChanged={loadRedirects} onDelete={deleteRedirect} />
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
  const [error, setError] = useState("");
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
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    data.id = freelancer.id;
    if (avatarPreview) data.avatar_url = avatarPreview;
    const res = await fetch("/api/admin/freelancers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      return;
    }
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
      <SlugField defaultValue={freelancer.slug} urlPrefix={`/hire-freelancers/${freelancer.category ? freelancer.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "category"}/`} />
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
      <SeoFieldsSection defaults={freelancer} />
      {error && <p className="text-sm text-red-600">{error}</p>}
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
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button
        onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
        className="mb-8 border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
      >
        {showForm ? "Cancel" : "+ Add business"}
      </button>

      {showForm && (
        <BusinessForm onCancel={() => setShowForm(false)} onSaved={() => { setShowForm(false); onChanged(); }} />
      )}

      <div className="space-y-4">
        {businesses.length === 0 && <p className="text-muted text-sm">No businesses yet.</p>}
        {businesses.map((b) =>
          editingId === b.id ? (
            <BusinessForm
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
                <button onClick={() => { setEditingId(b.id); setShowForm(false); }} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
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
    </div>
  );
}

function BusinessForm({
  business,
  onCancel,
  onSaved,
}: {
  business?: Business;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(business?.logo_url || null);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(business?.featured_image_url || null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const featuredInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(await resizeImageToDataUrl(file, 500, 0.85));
  }
  async function handleFeaturedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeaturedPreview(await resizeImageToDataUrl(file, 1200, 0.85));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (logoPreview) data.logo_url = logoPreview;
    if (featuredPreview) data.featured_image_url = featuredPreview;

    let res: Response;
    if (business) {
      data.id = business.id;
      res = await fetch("/api/admin/businesses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink p-6 mb-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Logo</label>
          <div className="flex items-center gap-4">
            <div onClick={() => logoInputRef.current?.click()} className="h-16 w-16 border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-muted">Logo</span>
              )}
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            <button type="button" onClick={() => logoInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
              Upload logo
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Featured image (banner)</label>
          <div className="flex items-center gap-4">
            <div onClick={() => featuredInputRef.current?.click()} className="h-16 w-24 border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
              {featuredPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-muted">Banner</span>
              )}
            </div>
            <input ref={featuredInputRef} type="file" accept="image/*" onChange={handleFeaturedChange} className="hidden" />
            <button type="button" onClick={() => featuredInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
              Upload banner
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input required name="company_name" defaultValue={business?.company_name} placeholder="Company name" className={inputCls} />
        <input required name="contact_person" defaultValue={business?.contact_person} placeholder="Contact person" className={inputCls} />
      </div>
      <SlugField defaultValue={business?.slug} urlPrefix="/businesses/" />
      <div className="grid sm:grid-cols-2 gap-4">
        <input required type="email" name="email" defaultValue={business?.email} placeholder="Email" className={inputCls} />
        <input name="phone" defaultValue={business?.phone || ""} placeholder="Phone" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required name="industry" defaultValue={business?.industry} placeholder="Industry" className={inputCls} />
        <input name="company_size" defaultValue={business?.company_size || ""} placeholder="Company size" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="website" defaultValue={business?.website || ""} placeholder="Website" className={inputCls} />
        <input name="location" defaultValue={business?.location || ""} placeholder="Location" className={inputCls} />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Description / content</label>
        <RichTextEditor name="description" defaultValue={business?.description} />
      </div>

      <SeoFieldsSection defaults={business} />
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : business ? "Save changes" : "Add business"}
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

  return (
    <div>
      <button
        onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
        className="mb-8 border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
      >
        {showForm ? "Cancel" : "+ Add profile"}
      </button>

      {showForm && (
        <ProfileForm onCancel={() => setShowForm(false)} onSaved={() => { setShowForm(false); onChanged(); }} />
      )}

      <div className="space-y-3">
        {profiles.length === 0 && <p className="text-muted text-sm">No profiles added yet.</p>}
        {profiles.map((p) =>
          editingId === p.id ? (
            <ProfileForm
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

function ProfileForm({
  profile,
  onCancel,
  onSaved,
}: {
  profile?: EntrepreneurProfile;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(await resizeImageToDataUrl(file, 500, 0.85));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (avatarPreview) data.avatar_url = avatarPreview;

    let res: Response;
    if (profile) {
      data.id = profile.id;
      res = await fetch("/api/admin/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch("/api/admin/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink p-6 mb-8 space-y-4">
      <div className="flex items-center gap-5">
        <div onClick={() => fileInputRef.current?.click()} className="h-20 w-20 rounded-full border border-line bg-ink/5 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">Photo</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-line px-4 py-2 text-sm hover:border-ink transition-colors">
          {avatarPreview ? "Change photo" : "Upload photo"}
        </button>
      </div>

      <input required name="full_name" defaultValue={profile?.full_name} placeholder="Full name" className={inputCls} />
      <SlugField defaultValue={profile?.slug} urlPrefix="/profiles/" />
      <select required name="category" defaultValue={profile?.category || ""} className={inputCls}>
        <option value="" disabled>Category</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input required name="title" defaultValue={profile?.title} placeholder="Title (e.g. Founder & CEO)" className={inputCls} />
      <input name="company_name" defaultValue={profile?.company_name || ""} placeholder="Company name" className={inputCls} />

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Bio / full profile content</label>
        <RichTextEditor name="bio" defaultValue={profile?.bio} />
      </div>

      <input name="location" defaultValue={profile?.location || ""} placeholder="Location" className={inputCls} />
      <input name="website" defaultValue={profile?.website || ""} placeholder="Website URL" className={inputCls} />
      <input name="linkedin_url" defaultValue={profile?.linkedin_url || ""} placeholder="LinkedIn URL" className={inputCls} />

      <SeoFieldsSection defaults={profile} />
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : profile ? "Save changes" : "Add profile"}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ---------------- Blog ---------------- */


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
  const [error, setError] = useState("");
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
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (imagePreview) data.featured_image_url = imagePreview;

    let res: Response;
    if (post) {
      data.id = post.id;
      res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      return;
    }
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
      <SlugField defaultValue={post?.slug} urlPrefix="/blog/" />
      <input name="author" defaultValue={post?.author || ""} placeholder="Author name (optional)" className={inputCls} />
      <textarea name="excerpt" defaultValue={post?.excerpt || ""} rows={2} placeholder="Short excerpt (shown in listing)" className={inputCls} />
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Content</label>
        <RichTextEditor name="content" defaultValue={post?.content} />
        <p className="mt-2 text-xs text-muted">
          Use H2/H3 for headings, the Image button to drop a picture in the
          middle of the post, and Link to turn selected text into a
          clickable link (paste any URL on your own site for internal
          linking, e.g. /hire-freelancers/seo).
        </p>
      </div>
      <SeoFieldsSection defaults={post} />
      {error && <p className="text-sm text-red-600">{error}</p>}
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

/* ---------------- Pages (static page SEO) ---------------- */

function PagesTab() {
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [contents, setContents] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [seoRes, contentRes] = await Promise.all([
      fetch("/api/admin/pages"),
      fetch("/api/admin/page-content"),
    ]);
    if (seoRes.ok) setPages((await seoRes.json()).pages);
    if (contentRes.ok) setContents((await contentRes.json()).pages);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSeo(page_key: string, fields: Record<string, string>) {
    await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_key, ...fields }),
    });
    load();
  }

  async function saveContent(page_key: string, content: string) {
    await fetch("/api/admin/page-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_key, content }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted max-w-xl">
        Set the meta title, description, canonical URL and focus keyword
        for each page — used by search engines. For Services pages, you
        can also edit the actual page content below (the page layout
        stays the same, only this text changes).
      </p>
      {loading && <p className="text-sm text-muted">Loading...</p>}
      {PAGE_KEYS.map(({ key, label }) => {
        const existingSeo = pages.find((p) => p.page_key === key);
        const existingContent = contents.find((c) => c.page_key === key);
        const hasContentEditor = key.includes("services") || key === "recruitment-services" || key === "talent-acquisition" || key === "business-growth-consultancy";
        return (
          <PageSeoForm
            key={key}
            pageKey={key}
            label={label}
            existingSeo={existingSeo}
            existingContent={existingContent?.content}
            showContentEditor={hasContentEditor}
            onSaveSeo={saveSeo}
            onSaveContent={saveContent}
          />
        );
      })}
    </div>
  );
}

function PageSeoForm({
  pageKey,
  label,
  existingSeo,
  existingContent,
  showContentEditor,
  onSaveSeo,
  onSaveContent,
}: {
  pageKey: string;
  label: string;
  existingSeo?: PageSeo;
  existingContent?: string | null;
  showContentEditor?: boolean;
  onSaveSeo: (pageKey: string, fields: Record<string, string>) => void;
  onSaveContent: (pageKey: string, content: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const { content, ...seoFields } = data;
    onSaveSeo(pageKey, seoFields);
    if (showContentEditor) onSaveContent(pageKey, content || "");
    setSaving(false);
  }

  return (
    <div className="border border-line">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <h3 className="font-medium text-ink">{label}</h3>
        <span className="text-muted text-sm">{expanded ? "−" : "+"}</span>
      </button>
      {expanded && (
        <form onSubmit={handleSubmit} className="p-5 pt-0 space-y-3 border-t border-line">
          <input name="meta_title" defaultValue={existingSeo?.meta_title || ""} placeholder="Meta title" className={inputCls} />
          <textarea name="meta_description" defaultValue={existingSeo?.meta_description || ""} rows={2} placeholder="Meta description" className={inputCls} />
          <input name="canonical_url" defaultValue={existingSeo?.canonical_url || ""} placeholder="Canonical URL (optional)" className={inputCls} />
          <input name="focus_keyword" defaultValue={existingSeo?.focus_keyword || ""} placeholder="Focus keyword" className={inputCls} />
          {showContentEditor && (
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Page content (leave empty to use the default text)
              </label>
              <RichTextEditor name="content" defaultValue={existingContent || ""} />
            </div>
          )}
          <button disabled={saving} className="bg-ink text-paper px-5 py-2 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------------- Redirects ---------------- */

function RedirectsTab({
  redirects,
  onChanged,
  onDelete,
}: {
  redirects: Redirect[];
  onChanged: () => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = redirects.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return r.source_path.toLowerCase().includes(q) || r.destination_path.toLowerCase().includes(q);
  });

  async function toggleActive(r: Redirect) {
    await fetch("/api/admin/redirects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, is_active: !r.is_active }),
    });
    onChanged();
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted max-w-xl">
        Send visitors and search engines from an old URL to a new one. A{" "}
        <strong>301</strong> redirect means &quot;this page has moved for
        good&quot; (use this for almost everything). A <strong>302</strong>{" "}
        means &quot;this is temporary.&quot; Turn a redirect off instead of
        deleting it if you might need it again.
      </p>

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by URL..."
          className={`${inputCls} max-w-xs`}
        />
        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors"
          >
            + Add redirect
          </button>
        )}
      </div>

      {showForm && (
        <RedirectForm
          redirect={editingId ? redirects.find((r) => r.id === editingId) : undefined}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingId(null);
            onChanged();
          }}
        />
      )}

      <div className="border border-line divide-y divide-line">
        {filtered.length === 0 && (
          <p className="text-sm text-muted px-5 py-6">
            {redirects.length === 0 ? "No redirects yet." : "No redirects match your search."}
          </p>
        )}
        {filtered.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm">
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-ink font-medium">{r.source_path}</code>
                <span className="text-muted">→</span>
                <code className="text-muted">{r.destination_path}</code>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                <span className="border border-line px-1.5 py-0.5">{r.redirect_type}</span>
                <span className={r.is_active ? "text-green-600" : "text-amber-600"}>
                  {r.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => toggleActive(r)} className="text-muted hover:text-ink transition-colors">
                {r.is_active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => {
                  setEditingId(r.id);
                  setShowForm(true);
                }}
                className="text-muted hover:text-ink transition-colors"
              >
                Edit
              </button>
              <button onClick={() => onDelete(r.id)} className="text-red-600 hover:text-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RedirectForm({
  redirect,
  onCancel,
  onSaved,
}: {
  redirect?: Redirect;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const payload = {
      source_path: String(data.source_path || ""),
      destination_path: String(data.destination_path || ""),
      redirect_type: Number(data.redirect_type) === 302 ? 302 : 301,
      is_active: data.is_active === "on",
    };
    const res = await fetch("/api/admin/redirects", {
      method: redirect ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(redirect ? { id: redirect.id, ...payload } : payload),
    });
    setSaving(false);
    if (res.ok) {
      onSaved();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line p-5 space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1">Source URL / path (the old one)</label>
          <input
            name="source_path"
            defaultValue={redirect?.source_path || ""}
            placeholder="/old-page"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Destination URL / path (the new one)</label>
          <input
            name="destination_path"
            defaultValue={redirect?.destination_path || ""}
            placeholder="/new-page"
            required
            className={inputCls}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <label className="block text-xs text-muted mb-1">Redirect type</label>
          <select name="redirect_type" defaultValue={redirect?.redirect_type ?? 301} className={inputCls}>
            <option value={301}>301 — Permanent</option>
            <option value={302}>302 — Temporary</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink mt-4 sm:mt-5">
          <input type="checkbox" name="is_active" defaultChecked={redirect?.is_active ?? true} />
          Active
        </label>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : redirect ? "Save changes" : "Add redirect"}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
