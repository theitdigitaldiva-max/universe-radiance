import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPeso } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order ?? "";
  const supabase = createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .single();

  return (
    <div className="container-site py-16">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C5A477" strokeWidth="2" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-5 font-serif text-3xl text-charcoal">Thank You!</h1>
        <p className="mt-3 text-charcoal/70">
          Your order request has been received. We will contact you personally
          to confirm availability, shipping, and payment.
        </p>
        {order && (
          <div className="mt-6 rounded-2xl bg-lavender/25 p-5 text-left">
            <p className="text-xs uppercase tracking-widest text-plum">Order Number</p>
            <p className="font-serif text-2xl text-charcoal">{order.order_number}</p>
            <ul className="mt-3 space-y-1 text-sm text-charcoal/70">
              {order.order_items.map((item: { id: string; quantity: number; product_name: string; size: string | null; unit_price: number }) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.quantity} × {item.product_name} ({item.size ?? "—"})</span>
                  <span>{formatPeso(item.unit_price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-plum/20 pt-2 font-medium text-charcoal">
              <span>Subtotal</span>
              <span>{formatPeso(order.subtotal)}</span>
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
          <Link href="/" className="btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
