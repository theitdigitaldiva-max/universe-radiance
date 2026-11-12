"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  stock: number;
};

export function ProductPurchase({ productId, slug, name, price, image, sizes, stock }: Props) {
  const [size, setSize] = useState(sizes[0] ?? "Standard");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const inStock = stock > 0;

  const handleAdd = () => {
    if (!inStock) return;
    addItem({ productId, slug, name, price, image, size, quantity, stock });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div>
        <span className="label-field">Bracelet Size</span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                size === s
                  ? "border-plum bg-plum text-ivory"
                  : "border-lavender bg-white text-charcoal hover:border-plum"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <span className="label-field">Quantity</span>
          <div className="flex items-center rounded-full border border-lavender bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-lg text-plum"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
              className="px-4 py-2 text-lg text-plum"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <p className="text-sm text-charcoal/60">
          {inStock ? `${stock} available` : "Made to order — ships in 5–7 days"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {inStock ? (
          <button onClick={handleAdd} className="btn-primary flex-1 sm:flex-none">
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        ) : (
          <a href="/customize" className="btn-primary flex-1 sm:flex-none">
            Made to Order — Inquire
          </a>
        )}
        <a href="/cart" className="btn-outline">Go to Cart</a>
      </div>
    </div>
  );
}
