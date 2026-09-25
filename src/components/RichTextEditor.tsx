"use client";

import { useRef, useState } from "react";
import { resizeImageToDataUrl } from "@/lib/image";

export default function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(defaultValue || "");

  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncHtml();
  }

  function syncHtml() {
    if (editorRef.current) setHtml(editorRef.current.innerHTML);
  }

  function insertLink() {
    const selection = window.getSelection();
    const hasSelectedText = selection && selection.toString().trim().length > 0;
    const url = window.prompt("Link URL (e.g. https://reflax.org/hire-freelancers/seo, or any page):");
    if (!url) return;
    editorRef.current?.focus();
    if (hasSelectedText) {
      exec("createLink", url);
    } else {
      const anchorText = window.prompt("Anchor text (the clickable words):", url) || url;
      const safeText = anchorText.replace(/</g, "&lt;");
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${url}">${safeText}</a>`
      );
      syncHtml();
    }
  }

  async function insertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file, 900, 0.8);
    const altText = window.prompt("Alt text for this image (describe it for SEO/accessibility):", "") || "";
    editorRef.current?.focus();
    const safeAlt = altText.replace(/"/g, "&quot;");
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${dataUrl}" alt="${safeAlt}" style="max-width:100%;height:auto;display:block;margin:1.5rem 0;" />`
    );
    syncHtml();
    e.target.value = "";
  }

  return (
    <div className="border border-line">
      <div className="flex flex-wrap gap-1 border-b border-line p-2 bg-ink/[0.02]">
        <ToolbarButton label="H2" onClick={() => exec("formatBlock", "H2")} />
        <ToolbarButton label="H3" onClick={() => exec("formatBlock", "H3")} />
        <ToolbarButton label="P" onClick={() => exec("formatBlock", "P")} />
        <ToolbarButton label="B" bold onClick={() => exec("bold")} />
        <ToolbarButton label="I" italic onClick={() => exec("italic")} />
        <ToolbarButton label="• List" onClick={() => exec("insertUnorderedList")} />
        <ToolbarButton label="Link" onClick={insertLink} />
        <ToolbarButton label="Image" onClick={() => imageInputRef.current?.click()} />
        <input ref={imageInputRef} type="file" accept="image/*" onChange={insertImage} className="hidden" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncHtml}
        onBlur={syncHtml}
        dangerouslySetInnerHTML={{ __html: defaultValue || "" }}
        className="blog-content min-h-[300px] p-4 text-[15px] leading-relaxed text-ink focus:outline-none"
      />
      {/* Hidden field carries the HTML to the form submission */}
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  bold,
  italic,
}: {
  label: string;
  onClick: () => void;
  bold?: boolean;
  italic?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`px-3 py-1.5 text-xs border border-line hover:border-ink hover:bg-ink hover:text-paper transition-colors ${
        bold ? "font-bold" : ""
      } ${italic ? "italic" : ""}`}
    >
      {label}
    </button>
  );
}
