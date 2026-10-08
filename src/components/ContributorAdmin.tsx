"use client";

import { useRef, useState } from "react";
import { CONTRIBUTOR_NICHES, nicheLabel } from "@/lib/types";
import type { ContributorPost } from "@/lib/types";
import { resizeImageToDataUrl } from "@/lib/image";
import RichTextEditor from "@/components/RichTextEditor";
import SeoFieldsSection from "@/components/SeoFieldsSection";
import SlugField from "@/components/SlugField";

const inputCls = "w-full border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-ink";

export default function ContributorTab({
  posts,
  onChanged,
  onDelete,
}: {
  posts: ContributorPost[];
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
        {showForm ? "Cancel" : "+ New contributor post"}
      </button>

      {showForm && (
        <ContributorPostForm
          onCancel={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); onChanged(); }}
        />
      )}

      <div className="space-y-3">
        {posts.length === 0 && <p className="text-muted text-sm">No posts yet.</p>}
        {posts.map((post) =>
          editingId === post.id ? (
            <ContributorPostForm
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
                  <p className="text-xs text-muted mt-0.5">{nicheLabel(post.niche)} · /contributor/{post.slug}</p>
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

function ContributorPostForm({
  post,
  onCancel,
  onSaved,
}: {
  post?: ContributorPost;
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
      res = await fetch("/api/admin/contributor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch("/api/admin/contributor", {
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
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Niche</label>
        <select required name="niche" defaultValue={post?.niche || ""} className={inputCls}>
          <option value="" disabled>Choose a niche</option>
          {CONTRIBUTOR_NICHES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
        </select>
      </div>
      <SlugField defaultValue={post?.slug} urlPrefix="/contributor/" />
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
      <SeoFieldsSection defaults={post} pagePath={post ? `/contributor/${post.slug}` : undefined} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/85 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : post ? "Save changes" : "Publish contributor post"}
        </button>
        <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm text-muted hover:text-ink hover:border-ink transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

