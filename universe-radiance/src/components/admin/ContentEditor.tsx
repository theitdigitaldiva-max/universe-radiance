"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const LABELS: Record<string, string> = {
  announcement_text: "Top announcement bar text",
  hero_title: "Homepage hero title",
  hero_subtitle: "Homepage hero subtitle",
  about_heading: "About section heading",
  about_body: "About section body",
  contact_email: "Contact email",
  contact_phone: "Contact phone",
  instagram_url: "Instagram URL",
  facebook_url: "Facebook URL",
  shipping_note: "How ordering works note (contact page)",
};

export function ContentEditor({ content }: { content: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState(content);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    const supabase = createClient();
    await Promise.all(
      Object.entries(values).map(([key, value]) =>
        supabase.from("site_content").upsert({ key, value })
      )
    );
    setBusy(false);
    setSaved(true);
    router.refresh();
  };

  return (
    <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
      {Object.entries(values).map(([key, value]) => (
        <div key={key}>
          <label className="label-field" htmlFor={`sc-${key}`}>
            {LABELS[key] ?? key}
            <span className="ml-2 normal-case tracking-normal text-charcoal/40">({key})</span>
          </label>
          {key === "about_body" || key === "shipping_note" || key === "hero_subtitle" ? (
            <textarea
              id={`sc-${key}`}
              rows={3}
              value={value}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              className="input-field"
            />
          ) : (
            <input
              id={`sc-${key}`}
              value={value}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              className="input-field"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={busy} className="btn-primary !py-2 text-xs">
          {busy ? "Saving..." : "Save Content"}
        </button>
        {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
      </div>
    </form>
  );
}
