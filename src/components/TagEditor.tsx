"use client";

import { useState } from "react";

const VARIANT_CLASS: Record<string, string> = {
  like: "tag-like",
  dislike: "tag-dislike",
  cannot: "tag-cannot",
  default: "tag",
};

export default function TagEditor({
  tags,
  onChange,
  placeholder,
  variant = "default",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  variant?: "like" | "dislike" | "cannot" | "default";
}) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const v = draft.trim();
    if (!v) return;
    if (!tags.includes(v)) onChange([...tags, v]);
    setDraft("");
  }

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className={`tag ${VARIANT_CLASS[variant]}`}>
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="ml-0.5 text-[13px] leading-none opacity-60 hover:opacity-100"
              aria-label={`${t} 삭제`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          className="input !py-1.5 text-[13px]"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <button type="button" onClick={addTag} className="btn btn-ghost !px-3 !py-1.5 text-[13px]">
          추가
        </button>
      </div>
    </div>
  );
}
