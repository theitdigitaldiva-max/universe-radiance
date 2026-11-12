"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUploadField } from "./ImageUploadField";

type FieldType = "text" | "textarea" | "image";

type Field = { key: string; label: string; type?: FieldType; hint?: string };

type Section = { title: string; description?: string; fields: Field[] };

const SECTIONS: Section[] = [
  {
    title: "Announcement Bar",
    description: "The thin dark strip at the very top of every page.",
    fields: [
      { key: "announcement_text", label: "Announcement text", hint: "Leave blank to hide the bar." },
    ],
  },
  {
    title: "Homepage Hero (Big Banner)",
    description: "The large photo with your headline and two buttons at the top of the homepage.",
    fields: [
      { key: "hero_image", label: "Hero background photo", type: "image" },
      { key: "hero_title", label: "Headline" },
      { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
      { key: "hero_button1_text", label: "First button text" },
      { key: "hero_button1_link", label: "First button link", hint: "e.g. /shop or https://..." },
      { key: "hero_button2_text", label: "Second button text" },
      { key: "hero_button2_link", label: "Second button link", hint: "e.g. /customize or https://..." },
    ],
  },
  {
    title: "Intro Line",
    description: "The short statement shown under the hero.",
    fields: [{ key: "intro_text", label: "Intro text", type: "textarea" }],
  },
  {
    title: "Featured Collections",
    description: "The heading above your category tiles. The tiles themselves are managed under Categories.",
    fields: [
      { key: "collections_eyebrow", label: "Small gold label" },
      { key: "collections_heading", label: "Section heading" },
    ],
  },
  {
    title: "Search & Discover",
    description: "The search box section with gemstone chips.",
    fields: [
      { key: "search_eyebrow", label: "Small gold label" },
      { key: "search_heading", label: "Section heading" },
    ],
  },
  {
    title: "New Arrivals & Bestsellers",
    description: "The headings for the two product rows. Which products appear is set on each product (New arrival / Bestseller checkboxes).",
    fields: [
      { key: "new_arrivals_eyebrow", label: "New arrivals — small gold label" },
      { key: "new_arrivals_heading", label: "New arrivals — heading" },
      { key: "bestsellers_eyebrow", label: "Bestsellers — small gold label" },
      { key: "bestsellers_heading", label: "Bestsellers — heading" },
    ],
  },
  {
    title: "Custom Order Banner",
    description: "The plum-colored banner inviting visitors to design their own piece.",
    fields: [
      { key: "promo_image", label: "Banner photo", type: "image" },
      { key: "promo_eyebrow", label: "Small gold label" },
      { key: "promo_title", label: "Heading" },
      { key: "promo_body", label: "Paragraph", type: "textarea" },
      { key: "promo_button_text", label: "Button text" },
      { key: "promo_button_link", label: "Button link", hint: "e.g. /customize or https://..." },
    ],
  },
  {
    title: "Our Story Section",
    description: "The photo and text on the homepage that links to your About page.",
    fields: [
      { key: "about_image", label: "Section photo", type: "image" },
      { key: "about_eyebrow", label: "Small gold label" },
      { key: "about_heading", label: "Heading" },
      { key: "about_body", label: "Paragraph", type: "textarea" },
      { key: "about_button_text", label: "Button text" },
      { key: "about_button_link", label: "Button link", hint: "e.g. /about or https://..." },
    ],
  },
  {
    title: "Contact Banner (Dark Section)",
    description: "The dark strip near the bottom of the homepage with the email button.",
    fields: [
      { key: "cta_eyebrow", label: "Small gold label" },
      { key: "cta_heading", label: "Heading" },
      { key: "cta_body", label: "Paragraph", type: "textarea" },
      { key: "cta_button_text", label: "Button text" },
      { key: "cta_button_link", label: "Button link", hint: "e.g. /contact or https://..." },
    ],
  },
  {
    title: "Contact Details & Social Links",
    description: "Used in the contact banner, contact page, and footer.",
    fields: [
      { key: "contact_email", label: "Contact email", hint: "Shown as a clickable mailto button." },
      { key: "contact_phone", label: "Contact phone" },
      { key: "instagram_url", label: "Instagram URL" },
      { key: "instagram_handle", label: "Instagram handle (text shown on site)", hint: "e.g. @universeradiance" },
      { key: "facebook_url", label: "Facebook URL" },
      { key: "shipping_note", label: "“How Ordering Works” note (contact page)", type: "textarea" },
    ],
  },
  {
    title: "Instagram Photo Grid",
    description: "The 6 photos on the homepage that link to your Instagram. Upload, replace, or remove each one.",
    fields: [1, 2, 3, 4, 5, 6].map((n) => ({
      key: `ig_photo_${n}`,
      label: `Instagram photo ${n}`,
      type: "image" as FieldType,
    })),
  },
];

const ALL_KEYS = SECTIONS.flatMap((s) => s.fields.map((f) => f.key));

export function ContentEditor({ content }: { content: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(content);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    const supabase = createClient();
    await Promise.all(
      ALL_KEYS.map((key) =>
        supabase
          .from("site_content")
          .upsert({ key, value: (values[key] ?? "").trim() })
      )
    );
    setBusy(false);
    setSaved(true);
    router.refresh();
  };

  const setValue = (key: string, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  return (
    <form onSubmit={save} className="space-y-8">
      {SECTIONS.map((section) => (
        <section key={section.title} className="card p-6">
          <h2 className="font-serif text-xl text-charcoal">{section.title}</h2>
          {section.description && (
            <p className="mt-1 mb-5 text-sm text-charcoal/55">{section.description}</p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                {field.type === "image" ? (
                  <ImageUploadField
                    label={field.label}
                    value={values[field.key] ?? ""}
                    folder="home"
                    onChange={(url) => setValue(field.key, url)}
                  />
                ) : (
                  <>
                    <label className="label-field" htmlFor={`sc-${field.key}`}>
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={`sc-${field.key}`}
                        rows={3}
                        value={values[field.key] ?? ""}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <input
                        id={`sc-${field.key}`}
                        value={values[field.key] ?? ""}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        className="input-field"
                      />
                    )}
                    {field.hint && (
                      <p className="mt-1 text-xs text-charcoal/45">{field.hint}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex items-center gap-4 rounded-2xl border border-lavender bg-white p-4 shadow-md">
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Saving..." : "Save All Changes"}
        </button>
        {saved && <span className="text-sm text-emerald-700">Saved ✓ — live on the site immediately.</span>}
      </div>
    </form>
  );
}
