"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_discussion: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  quoted: "bg-indigo-100 text-indigo-800",
  ready_for_pickup: "bg-purple-100 text-purple-800",
  accepted: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  replied: "bg-emerald-100 text-emerald-800",
  paid: "bg-emerald-100 text-emerald-800",
  unpaid: "bg-rose-100 text-rose-800",
  cancelled: "bg-gray-200 text-gray-700",
  declined: "bg-gray-200 text-gray-700",
  closed: "bg-gray-200 text-gray-700",
  active: "bg-emerald-100 text-emerald-800",
  draft: "bg-gray-200 text-gray-700",
  archived: "bg-gray-200 text-gray-500",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize", STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function DeleteButton({
  table,
  id,
  label = "Delete",
}: {
  table: string;
  id: string;
  label?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);
    setBusy(false);
    setConfirming(false);
    router.refresh();
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button onClick={handleDelete} disabled={busy} className="text-xs font-medium uppercase tracking-wider text-red-600 hover:underline">
          {busy ? "Deleting..." : "Confirm"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs uppercase tracking-wider text-charcoal/50 hover:underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-xs uppercase tracking-wider text-red-500 hover:underline">
      {label}
    </button>
  );
}

export function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-charcoal/50">
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={cn("px-4 py-3 text-sm text-charcoal/80", className)}>
      {children}
    </td>
  );
}
