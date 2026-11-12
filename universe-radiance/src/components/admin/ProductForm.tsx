"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BRACELET_SIZES, COLOR_OPTIONS, GEMSTONE_OPTIONS } from "@/lib/constants";
import type { Category, Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

type FormState = {
  name: string;
  slug: string;
  description: string;
  symbolism: string;
  category_id: string;
  price: string;
  compare_at_price: string;
  gemstones: string[];
  custom_gemstones: string;
  colors: string[];
  sizes: string[];
  stock: string;
  status: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
};

export function ProductForm({
  product,
  categories,
}: {
  product: Product | null;
  categories: Category[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    symbolism: product?.symbolism ?? "",
    category_id: product?.category_id ?? "",
    price: product ? String(product.price) : "",
    compare_at_price: product?.compare_at_price ? String(product.compare_at_price) : "",
    gemstones: product?.gemstones ?? [],
    custom_gemstones: "",
    colors: product?.colors ?? [],
    sizes: product?.sizes ?? ["6.5in", "7in", "7.5in"],
    stock: product ? String(product.stock) : "0",
    status: product?.status ?? "active",
    is_featured: product?.is_featured ?? false,
    is_new_arrival: product?.is_new_arrival ?? false,
    is_bestseller: product?.is_bestseller ?? false,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  const toggle = (key: "gemstones" | "colors" | "sizes", value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const custom = form.custom_gemstones
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const gemstones = Array.from(new Set([...form.gemstones, ...custom]));
    const slug = form.slug.trim() || slugify(form.name);

    const payload = {
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      symbolism: form.symbolism.trim(),
      category_id: form.category_id || null,
      price: Number(form.price) || 0,
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      gemstones,
      colors: form.colors,
      sizes: form.sizes.length > 0 ? form.sizes : ["7in"],
      stock: Number(form.stock) || 0,
      status: form.status,
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
      is_bestseller: form.is_bestseller,
    };

    const supabase = createClient();
    const result = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (result.error) {
      setStatus("error");
      setError(
        result.error.code === "23505"
          ? "A product with this slug already exists. Change the slug."
          : "Could not save the product. Please try again."
      );
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label-field" htmlFor="pf-name">Product Name *</label>
          <input
            id="pf-name"
            required
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: product ? f.slug : slugify(e.target.value),
              }))
            }
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="pf-slug">Slug *</label>
          <input id="pf-slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="pf-category">Category</label>
          <select id="pf-category" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="pf-price">Price (₱) *</label>
          <input id="pf-price" type="number" min="0" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="pf-compare">Compare-at Price (₱)</label>
          <input id="pf-compare" type="number" min="0" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="pf-stock">Stock *</label>
          <input id="pf-stock" type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
          <p className="mt-1 text-xs text-charcoal/50">Set 0 to show “Made to Order”.</p>
        </div>
        <div>
          <label className="label-field" htmlFor="pf-status">Status</label>
          <select id="pf-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="label-field" htmlFor="pf-desc">Description</label>
        <textarea id="pf-desc" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
      </div>
      <div className="mt-4">
        <label className="label-field" htmlFor="pf-symbolism">Traditional Symbolism</label>
        <textarea id="pf-symbolism" rows={2} value={form.symbolism} onChange={(e) => setForm({ ...form, symbolism: e.target.value })} className="input-field" />
      </div>

      <div className="mt-5">
        <span className="label-field">Gemstones</span>
        <div className="flex flex-wrap gap-2">
          {GEMSTONE_OPTIONS.map((stone) => (
            <button
              key={stone}
              type="button"
              onClick={() => toggle("gemstones", stone)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                form.gemstones.includes(stone)
                  ? "border-plum bg-plum text-ivory"
                  : "border-lavender bg-white text-charcoal/70 hover:border-plum"
              }`}
            >
              {stone}
            </button>
          ))}
        </div>
        <input
          value={form.custom_gemstones}
          onChange={(e) => setForm({ ...form, custom_gemstones: e.target.value })}
          placeholder="Other stones, comma-separated..."
          className="input-field mt-2"
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <span className="label-field">Colors</span>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggle("colors", color)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  form.colors.includes(color)
                    ? "border-plum bg-plum text-ivory"
                    : "border-lavender bg-white text-charcoal/70 hover:border-plum"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="label-field">Sizes</span>
          <div className="flex flex-wrap gap-2">
            {[...BRACELET_SIZES, "Adjustable"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggle("sizes", size)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  form.sizes.includes(size)
                    ? "border-plum bg-plum text-ivory"
                    : "border-lavender bg-white text-charcoal/70 hover:border-plum"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-5">
        {(
          [
            ["is_featured", "Featured on homepage"],
            ["is_new_arrival", "New arrival"],
            ["is_bestseller", "Bestseller"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-charcoal/80">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              className="h-4 w-4 accent-plum"
            />
            {label}
          </label>
        ))}
      </div>

      {status === "error" && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
