"use client";

const inputCls = "w-full border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-ink";

export default function SlugField({
  defaultValue,
  urlPrefix,
}: {
  defaultValue?: string | null;
  urlPrefix: string;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">URL slug (SEO-friendly)</label>
      <div className="flex items-stretch">
        <span className="border border-r-0 border-line px-3 py-2.5 text-xs text-muted bg-ink/[0.02] flex items-center whitespace-nowrap">
          {urlPrefix}
        </span>
        <input
          name="slug"
          defaultValue={defaultValue || ""}
          placeholder="my-custom-url"
          className={inputCls}
        />
      </div>
      <p className="mt-1 text-xs text-muted">
        Lowercase letters, numbers and hyphens only. Leave as-is unless you
        want a specific URL for SEO.
      </p>
    </div>
  );
}
