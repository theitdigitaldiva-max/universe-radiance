"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

export function TestimonialManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    author_name: "",
    location: "",
    quote: "",
    rating: 5,
    is_published: true,
  });
  const [busy, setBusy] = useState(false);

  const startEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      author_name: t.author_name,
      location: t.location ?? "",
      quote: t.quote,
      rating: t.rating,
      is_published: t.is_published,
    });
  };

  const reset = () => {
    setEditing(null);
    setForm({ author_name: "", location: "", quote: "", rating: 5, is_published: true });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const supabase = createClient();
    const payload = {
      author_name: form.author_name.trim(),
      location: form.location.trim() || null,
      quote: form.quote.trim(),
      rating: form.rating,
      is_published: form.is_published,
    };
    if (editing) {
      await supabase.from("testimonials").update(payload).eq("id", editing.id);
    } else {
      const max = testimonials.reduce((m, t) => Math.max(m, t.sort_order), 0);
      await supabase.from("testimonials").insert({ ...payload, sort_order: max + 1 });
    }
    setBusy(false);
    reset();
    router.refresh();
  };

  const remove = async (id: string) => {
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={save} className="card h-fit space-y-4 p-6">
        <h2 className="font-serif text-xl text-charcoal">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
        <div>
          <label className="label-field" htmlFor="tm-author">Author *</label>
          <input id="tm-author" required value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="tm-loc">Location</label>
          <input id="tm-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="tm-rating">Rating</label>
          <select id="tm-rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="input-field">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} stars</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="tm-quote">Quote *</label>
          <textarea id="tm-quote" required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="input-field" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal/80">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 accent-plum" />
          Published on homepage
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="btn-primary !py-2 text-xs">
            {busy ? "Saving..." : editing ? "Save Changes" : "Add Testimonial"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="btn-outline !py-2 text-xs">Cancel</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif italic text-charcoal/90">“{t.quote}”</p>
                <p className="mt-2 text-sm text-charcoal/60">
                  — {t.author_name}{t.location ? `, ${t.location}` : ""} · {t.rating}★
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(t)} className="text-xs uppercase tracking-wider text-plum hover:underline">Edit</button>
                <button onClick={() => remove(t.id)} className="text-xs uppercase tracking-wider text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="card py-10 text-center text-charcoal/50">No testimonials yet.</div>
        )}
      </div>
    </div>
  );
}
