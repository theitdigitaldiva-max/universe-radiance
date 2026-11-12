"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { formatPeso } from "@/lib/utils";

function makeOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `UR-${suffix}`;
}

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("submitting");
    setError("");

    const supabase = createClient();
    const orderNumber = makeOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: form.customer_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || null,
        subtotal,
        shipping_fee: 0,
        total: subtotal,
        status: "pending",
        payment_status: "unpaid",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setStatus("error");
      setError("Could not place your order. Please try again.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        size: item.size,
        unit_price: item.price,
        quantity: item.quantity,
      }))
    );

    if (itemsError) {
      setStatus("error");
      setError("Could not save your order items. Please contact us with your order number.");
      return;
    }

    clearCart();
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order",
        data: {
          order_number: orderNumber,
          customer_name: form.customer_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
          items: items
            .map((item) => `${item.quantity}× ${item.name} (${item.size})`)
            .join(", "),
          total: formatPeso(subtotal),
        },
      }),
    }).catch(() => {});
    router.push(`/checkout/success?order=${orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center">
        <p className="font-serif text-xl text-charcoal">Your cart is empty.</p>
        <a href="/shop" className="btn-primary mt-5 inline-flex">Back to Shop</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal">Your Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="co-name">Full Name *</label>
            <input id="co-name" required value={form.customer_name} onChange={set("customer_name")} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="co-email">Email *</label>
            <input id="co-email" type="email" required value={form.email} onChange={set("email")} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="co-phone">Contact Number *</label>
            <input id="co-phone" required value={form.phone} onChange={set("phone")} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="co-address">Delivery Address *</label>
            <input id="co-address" required value={form.address} onChange={set("address")} className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label className="label-field" htmlFor="co-notes">Notes (optional)</label>
          <textarea id="co-notes" rows={3} value={form.notes} onChange={set("notes")} className="input-field" placeholder="Sizing requests, gift wrapping, preferred contact time..." />
        </div>
        <p className="mt-4 rounded-xl bg-lavender/25 p-4 text-xs leading-relaxed text-charcoal/70">
          No payment is collected on this website. After you submit, we confirm
          availability and total (including shipping) by email or SMS, and
          arrange GCash/bank transfer or meet-up payment with you.
        </p>
      </div>

      <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="font-serif text-xl text-charcoal">Your Order</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li key={`${item.productId}-${item.size}`} className="flex justify-between gap-2 text-charcoal/70">
              <span>{item.quantity} × {item.name} <span className="text-charcoal/40">({item.size})</span></span>
              <span>{formatPeso(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-lavender/60 pt-3 font-serif text-lg text-charcoal">
          <span>Subtotal</span>
          <span>{formatPeso(subtotal)}</span>
        </div>
        {status === "error" && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={status === "submitting"} className="btn-primary mt-5 w-full">
          {status === "submitting" ? "Placing Order..." : "Submit Order Request"}
        </button>
      </aside>
    </form>
  );
}
