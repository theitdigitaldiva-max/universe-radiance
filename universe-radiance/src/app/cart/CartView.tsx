"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPeso } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white py-20 text-center">
        <p className="font-serif text-2xl text-charcoal">Your cart is empty</p>
        <p className="mt-2 text-sm text-charcoal/60">
          Discover a piece that speaks to your story.
        </p>
        <Link href="/shop" className="btn-primary mt-6">Browse the Collection</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-lavender/20">
              <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/product/${item.slug}`} className="font-serif text-lg text-charcoal hover:text-plum">
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs uppercase tracking-widest text-charcoal/50">
                    Size {item.size}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-xs uppercase tracking-widest text-plum hover:text-charcoal"
                >
                  Remove
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-full border border-lavender">
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    className="px-3 py-1 text-plum"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                    className="px-3 py-1 text-plum"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="font-medium text-charcoal">
                  {formatPeso(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-charcoal/70">
            <span>Subtotal</span>
            <span>{formatPeso(subtotal)}</span>
          </div>
          <div className="flex justify-between text-charcoal/70">
            <span>Shipping</span>
            <span>Confirmed after order</span>
          </div>
          <div className="flex justify-between border-t border-lavender/60 pt-2 font-serif text-lg text-charcoal">
            <span>Total</span>
            <span>{formatPeso(subtotal)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-charcoal/50">
          No online payment — we confirm your order personally, then arrange
          GCash/bank transfer or meet-up.
        </p>
        <Link href="/checkout" className="btn-primary mt-5 w-full">
          Proceed to Order Request
        </Link>
      </aside>
    </div>
  );
}
