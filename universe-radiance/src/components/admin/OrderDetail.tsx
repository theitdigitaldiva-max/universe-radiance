"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Order } from "@/lib/types";
import { formatPeso, formatDate } from "@/lib/utils";
import { StatusBadge } from "./ui";

export function OrderDetail({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<Order["status"]>(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [paymentMethod, setPaymentMethod] = useState(order.payment_method ?? "");
  const [shipping, setShipping] = useState(String(order.shipping_fee));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const subtotal = Number(order.subtotal);
  const shippingFee = Number(shipping) || 0;

  const save = async () => {
    setBusy(true);
    setSaved(false);
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({
        status,
        payment_status: paymentStatus,
        payment_method: paymentMethod.trim() || null,
        shipping_fee: shippingFee,
        total: subtotal + shippingFee,
      })
      .eq("id", order.id);
    setBusy(false);
    setSaved(true);
    router.refresh();
  };

  return (
    <div className="mt-3 rounded-xl bg-lavender/15 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="label-field !mb-1">Customer</p>
          <p className="text-sm font-medium text-charcoal">{order.customer_name}</p>
          <p className="text-sm text-charcoal/70">{order.email}</p>
          <p className="text-sm text-charcoal/70">{order.phone}</p>
          <p className="mt-2 text-sm text-charcoal/70">{order.address}</p>
        </div>
        <div>
          <p className="label-field !mb-1">Placed</p>
          <p className="text-sm text-charcoal/80">{formatDate(order.created_at)}</p>
          {order.notes && (
            <>
              <p className="label-field mt-3 !mb-1">Customer Notes</p>
              <p className="text-sm italic text-charcoal/70">{order.notes}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-lavender/40 pt-4">
        <p className="label-field !mb-1">Items</p>
        <ul className="space-y-1 text-sm">
          {(order.order_items ?? []).map((item) => (
            <li key={item.id} className="flex justify-between text-charcoal/80">
              <span>
                {item.quantity} × {item.product_name}
                <span className="text-charcoal/50"> ({item.size ?? "—"})</span>
              </span>
              <span>{formatPeso(Number(item.unit_price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-1 border-t border-lavender/40 pt-2 text-sm">
          <div className="flex justify-between text-charcoal/70">
            <span>Subtotal</span><span>{formatPeso(subtotal)}</span>
          </div>
          <div className="flex justify-between font-medium text-charcoal">
            <span>Total (with shipping)</span><span>{formatPeso(subtotal + shippingFee)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-lavender/40 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label-field" htmlFor={`od-status-${order.id}`}>Order Status</label>
          <select
            id={`od-status-${order.id}`}
            value={status}
            onChange={(e) => setStatus(e.target.value as Order["status"])}
            className="input-field"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor={`od-pay-${order.id}`}>Payment Status</label>
          <select
            id={`od-pay-${order.id}`}
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as "unpaid" | "paid")}
            className="input-field"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor={`od-method-${order.id}`}>Payment Method</label>
          <input
            id={`od-method-${order.id}`}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="GCash, BPI, meet-up..."
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor={`od-ship-${order.id}`}>Shipping Fee (₱)</label>
          <input
            id={`od-ship-${order.id}`}
            type="number"
            min="0"
            step="0.01"
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button onClick={save} disabled={busy} className="btn-primary !py-2 text-xs">
          {busy ? "Saving..." : "Save Order"}
        </button>
        {saved && <span className="text-xs text-emerald-700">Saved ✓</span>}
        <StatusBadge status={order.status} />
      </div>
    </div>
  );
}
