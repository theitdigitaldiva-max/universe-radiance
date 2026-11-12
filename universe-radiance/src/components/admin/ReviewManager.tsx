"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Review } from "@/lib/types";
import { Stars } from "@/components/ui/Stars";

export function ReviewManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const act = async (id: string, action: "approve" | "unapprove" | "delete") => {
    setBusy(id + action);
    const supabase = createClient();
    if (action === "delete") {
      await supabase.from("reviews").delete().eq("id", id);
    } else {
      await supabase
        .from("reviews")
        .update({ approved: action === "approve" })
        .eq("id", id);
    }
    setBusy(null);
    router.refresh();
  };

  if (reviews.length === 0) {
    return <div className="card py-10 text-center text-charcoal/50">No reviews yet.</div>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <Stars rating={review.rating} />
                <span className="text-sm font-medium text-charcoal">{review.author_name}</span>
                <span className={`badge ${review.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {review.approved ? "Approved" : "Pending"}
                </span>
              </div>
              {review.title && <p className="mt-2 font-medium text-charcoal">{review.title}</p>}
              <p className="mt-1 text-sm text-charcoal/75">{review.body}</p>
            </div>
            <div className="flex gap-3">
              {!review.approved && (
                <button
                  onClick={() => act(review.id, "approve")}
                  disabled={busy !== null}
                  className="text-xs uppercase tracking-wider text-emerald-700 hover:underline"
                >
                  Approve
                </button>
              )}
              {review.approved && (
                <button
                  onClick={() => act(review.id, "unapprove")}
                  disabled={busy !== null}
                  className="text-xs uppercase tracking-wider text-charcoal/60 hover:underline"
                >
                  Unapprove
                </button>
              )}
              <button
                onClick={() => act(review.id, "delete")}
                disabled={busy !== null}
                className="text-xs uppercase tracking-wider text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
