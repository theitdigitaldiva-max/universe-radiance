"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  stock: number;
  quantity?: number;
  label?: string;
  className?: string;
};

export function AddToCartButton({
  productId,
  slug,
  name,
  price,
  image,
  size,
  stock,
  quantity = 1,
  label = "Add to Cart",
  className = "btn-outline flex-1",
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = stock <= 0;

  const handleClick = () => {
    if (disabled) return;
    addItem({ productId, slug, name, price, image, size, quantity, stock });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button onClick={handleClick} disabled={disabled} className={className}>
      {disabled ? "Out of Stock" : added ? "Added ✓" : label}
    </button>
  );
}
