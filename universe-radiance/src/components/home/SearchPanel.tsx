"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by stone, meaning, or product name..."
        className="input-field flex-1 !rounded-full !py-3"
      />
      <button type="submit" className="btn-primary whitespace-nowrap">
        Search
      </button>
    </form>
  );
}
