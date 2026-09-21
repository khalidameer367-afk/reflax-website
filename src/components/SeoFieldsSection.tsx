"use client";

import { useState } from "react";
import type { SeoFields } from "@/lib/types";

const inputCls = "w-full border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-ink";

export default function SeoFieldsSection({ defaults }: { defaults?: Partial<SeoFields> }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-ink"
      >
        SEO settings (meta title, description, slug, canonical, focus keyword)
        <span className="text-muted">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-3 border-t border-line">
          <div>
            <label className="block text-xs text-muted mb-1">Meta title</label>
            <input name="meta_title" defaultValue={defaults?.meta_title || ""} className={inputCls} placeholder="Shown in search engine results as the page title" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Meta description</label>
            <textarea name="meta_description" defaultValue={defaults?.meta_description || ""} rows={2} className={inputCls} placeholder="1-2 sentence summary shown under the title in search results" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Canonical URL</label>
            <input name="canonical_url" defaultValue={defaults?.canonical_url || ""} className={inputCls} placeholder="Leave empty unless this content duplicates another URL" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Focus keyword</label>
            <input name="focus_keyword" defaultValue={defaults?.focus_keyword || ""} className={inputCls} placeholder="Main keyword this page should rank for" />
          </div>
        </div>
      )}
    </div>
  );
}
