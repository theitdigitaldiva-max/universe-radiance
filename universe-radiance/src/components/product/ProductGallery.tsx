"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [selected, setSelected] = useState(0);
  const current = sorted[selected];

  if (!current) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-lavender/20">
        <Image src="/images/hero-display.jpg" alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-lavender/20">
        <Image
          src={current.url}
          alt={current.alt ?? name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-3">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelected(index)}
              className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition ${
                index === selected ? "border-plum" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Photo ${index + 1}`}
            >
              <Image src={image.url} alt={image.alt ?? name} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
