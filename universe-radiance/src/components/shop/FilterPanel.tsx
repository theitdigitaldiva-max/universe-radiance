"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { COLOR_OPTIONS, GEMSTONE_OPTIONS } from "@/lib/constants";
import type { Category } from "@/lib/types";

export type FilterValues = {
  category: string;
  gemstone: string;
  color: string;
  minPrice: string;
  maxPrice: string;
  availability: string;
  sort: string;
  q: string;
};

export function FilterPanel({
  categories,
  initial,
}: {
  categories: Category[];
  initial: FilterValues;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterValues>(initial);

  const set = (key: keyof FilterValues) => (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    (Object.keys(filters) as Array<keyof FilterValues>).forEach((key) => {
      const value = filters[key].trim();
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  };

  const reset = () => {
    setFilters({
      category: "",
      gemstone: "",
      color: "",
      minPrice: "",
      maxPrice: "",
      availability: "",
      sort: "",
      q: "",
    });
    router.push("/shop");
  };

  return (
    <form
      onSubmit={apply}
      className="space-y-4 rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-24"
    >
      <div>
        <label className="label-field" htmlFor="filter-q">Search</label>
        <input
          id="filter-q"
          type="search"
          value={filters.q}
          onChange={set("q")}
          placeholder="Name or meaning..."
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="filter-category">Category</label>
        <select id="filter-category" value={filters.category} onChange={set("category")} className="input-field">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-gemstone">Gemstone</label>
        <select id="filter-gemstone" value={filters.gemstone} onChange={set("gemstone")} className="input-field">
          <option value="">All gemstones</option>
          {GEMSTONE_OPTIONS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-color">Color</label>
        <select id="filter-color" value={filters.color} onChange={set("color")} className="input-field">
          <option value="">All colors</option>
          {COLOR_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="label-field">Price Range (₱)</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={set("minPrice")}
            placeholder="Min"
            className="input-field"
            aria-label="Minimum price"
          />
          <span className="text-charcoal/40">–</span>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={set("maxPrice")}
            placeholder="Max"
            className="input-field"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-availability">Availability</label>
        <select id="filter-availability" value={filters.availability} onChange={set("availability")} className="input-field">
          <option value="">Any</option>
          <option value="in_stock">In stock</option>
          <option value="made_to_order">Made to order</option>
        </select>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-sort">Sort by</label>
        <select id="filter-sort" value={filters.sort} onChange={set("sort")} className="input-field">
          <option value="">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1 !px-3 text-xs">Apply Filters</button>
        <button type="button" onClick={reset} className="btn-outline flex-1 !px-3 text-xs">
          Reset
        </button>
      </div>
    </form>
  );
}
