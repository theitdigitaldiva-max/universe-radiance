"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function StatusSelect({
  table,
  id,
  column = "status",
  current,
  options,
}: {
  table: string;
  id: string;
  column?: string;
  current: string;
  options: readonly string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [busy, setBusy] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setValue(next);
    setBusy(true);
    const supabase = createClient();
    await supabase.from(table).update({ [column]: next }).eq("id", id);
    setBusy(false);
    router.refresh();
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={busy}
      className="rounded-lg border border-lavender bg-white px-2 py-1 text-xs capitalize"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
