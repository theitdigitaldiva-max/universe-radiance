import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productImage } from "@/lib/data";
import { formatPeso } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const image = productImage(product);
  const inStock = product.stock > 0;

  return (
    <div className="card group flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-lavender/20">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_bestseller && <span className="badge bg-gold/90 text-charcoal">Bestseller</span>}
          {product.is_new_arrival && <span className="badge">New</span>}
          {!inStock && <span className="badge bg-charcoal/80 text-ivory">Made to Order</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] uppercase tracking-widest text-plum">
          {product.category?.name ?? "Bracelet"}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg leading-snug text-charcoal hover:text-plum">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-charcoal/60">{product.gemstones.join(" · ")}</p>

        <div className="flex flex-wrap gap-1">
          {product.sizes.map((size) => (
            <span key={size} className="rounded border border-lavender px-1.5 py-0.5 text-[10px] text-charcoal/60">
              {size}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-serif text-lg text-charcoal">
            {formatPeso(product.price)}
            {product.compare_at_price && (
              <span className="ml-2 text-sm text-plum/60 line-through">
                {formatPeso(product.compare_at_price)}
              </span>
            )}
          </p>
          <span className={`text-[11px] font-medium uppercase tracking-wider ${inStock ? "text-emerald-700" : "text-plum"}`}>
            {inStock ? `${product.stock} in stock` : "Made to order"}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <Link href={`/product/${product.slug}`} className="btn-primary flex-1 !py-2 text-xs">
            View Details
          </Link>
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={image}
            size={product.sizes[0] ?? "Standard"}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}
