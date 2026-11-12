import { createClient } from "@/lib/supabase/server";
import { StatusSelect, Td, Th } from "@/components/admin/ui";
import { CUSTOMIZATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Custom Requests" };

export default async function AdminCustomRequestsPage() {
  const supabase = createClient();
  const { data: requests } = await supabase
    .from("customization_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Custom Bracelet Requests</h1>

      <div className="mt-6 space-y-3">
        {(requests ?? []).map((request) => (
          <details key={request.id} className="card">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-medium text-charcoal">{request.name}</span>
                <span className="text-sm text-charcoal/70">{request.preferred_gemstones || "Stones TBD"}</span>
                <span className="text-sm text-charcoal/50">{request.budget_range ?? ""}</span>
              </div>
              <span className="text-xs text-charcoal/50">{formatDate(request.created_at.slice(0, 10))}</span>
            </summary>
            <div className="space-y-3 border-t border-lavender/40 px-5 py-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <p><span className="label-field !mb-0 inline">Email: </span>{request.email}</p>
                <p><span className="label-field !mb-0 inline">Phone: </span>{request.phone}</p>
                <p><span className="label-field !mb-0 inline">Size: </span>{request.bracelet_size ?? "—"}</p>
                <p><span className="label-field !mb-0 inline">Budget: </span>{request.budget_range ?? "—"}</p>
              </div>
              {request.design_preferences && (
                <p><span className="label-field !mb-0 inline">Design: </span>{request.design_preferences}</p>
              )}
              {request.additional_instructions && (
                <p className="whitespace-pre-wrap rounded-xl bg-lavender/15 p-3 text-charcoal/80">
                  {request.additional_instructions}
                </p>
              )}
              <div>
                <span className="label-field">Status</span>
                <StatusSelect
                  table="customization_requests"
                  id={request.id}
                  current={request.status}
                  options={CUSTOMIZATION_STATUSES}
                />
              </div>
            </div>
          </details>
        ))}
        {requests?.length === 0 && (
          <div className="card py-12 text-center text-charcoal/50">No custom requests yet.</div>
        )}
      </div>
    </div>
  );
}
