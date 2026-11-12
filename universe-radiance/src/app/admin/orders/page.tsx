import { createClient } from "@/lib/supabase/server";
import { OrderDetail } from "@/components/admin/OrderDetail";
import { StatusBadge, Td, Th } from "@/components/admin/ui";
import { formatPeso } from "@/lib/utils";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Orders</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Customers submit order requests (no online payment). Confirm each one,
        arrange payment outside the site, and track it here.
      </p>

      <div className="mt-6 space-y-3">
        {(orders ?? []).map((order) => (
          <details key={order.id} className="card group">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-medium text-charcoal">{order.order_number}</span>
                <span className="text-sm text-charcoal/70">{order.customer_name}</span>
                <span className="text-sm text-charcoal/70">
                  {(order.order_items ?? []).reduce((n: number, i: { quantity: number }) => n + i.quantity, 0)} items
                </span>
                <span className="font-serif text-lg">{formatPeso(Number(order.total))}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <StatusBadge status={order.payment_status} />
                <span className="text-xs text-plum group-open:hidden">Expand ▾</span>
              </div>
            </summary>
            <div className="px-5 pb-5">
              <OrderDetail order={order as Order} />
            </div>
          </details>
        ))}
        {orders?.length === 0 && (
          <div className="card py-12 text-center text-charcoal/50">No orders yet.</div>
        )}
      </div>
    </div>
  );
}
