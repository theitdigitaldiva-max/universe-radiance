"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/utils";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "" });
  const [busy, setBusy] = useState(false);

  const startEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image_url: category.image_url ?? "",
    });
  };

  const reset = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image_url: "" });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
    };
    if (editing) {
      await supabase.from("categories").update(payload).eq("id", editing.id);
    } else {
      const max = categories.reduce((m, c) => Math.max(m, c.sort_order), 0);
      await supabase.from("categories").insert({ ...payload, sort_order: max + 1 });
    }
    setBusy(false);
    reset();
    router.refresh();
  };

  const remove = async (id: string) => {
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={save} className="card h-fit space-y-4 p-6">
        <h2 className="font-serif text-xl text-charcoal">
          {editing ? "Edit Category" : "New Category"}
        </h2>
        <div>
          <label className="label-field" htmlFor="cat-name">Name *</label>
          <input
            id="cat-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="cat-slug">Slug</label>
          <input
            id="cat-slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder={slugify(form.name) || "auto-generated"}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="cat-desc">Description</label>
          <textarea
            id="cat-desc"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="cat-img">Image URL</label>
          <input
            id="cat-img"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="/images/hero-display.jpg"
            className="input-field"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="btn-primary !py-2 text-xs">
            {busy ? "Saving..." : editing ? "Save Changes" : "Add Category"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="btn-outline !py-2 text-xs">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead className="bg-lavender/15">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-charcoal/50">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-charcoal/50">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-charcoal/50">Sort Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-charcoal/50"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lavender/30">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3 text-sm font-medium text-charcoal">{category.name}</td>
                <td className="px-4 py-3 text-sm text-charcoal/60">{category.slug}</td>
                <td className="px-4 py-3 text-sm text-charcoal/60">{category.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(category)} className="text-xs uppercase tracking-wider text-plum hover:underline">
                      Edit
                    </button>
                    <button onClick={() => remove(category.id)} className="text-xs uppercase tracking-wider text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
