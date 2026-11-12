import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ReviewSection } from "@/components/product/ReviewSection";
import {
  getApprovedReviews,
  getProductBySlug,
  getRelatedProducts,
  productImage,
} from "@/lib/data";
import { formatPeso } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getApprovedReviews(product.id),
    getRelatedProducts(product),
  ]);
  const image = productImage(product);

  return (
    <div className="container-site py-10">
      <nav className="mb-6 text-xs uppercase tracking-widest text-charcoal/50">
        <Link href="/" className="hover:text-plum">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-plum">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-plum">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.product_images ?? []}
          name={product.name}
        />

        <div>
          {product.category && (
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-xs uppercase tracking-[0.25em] text-gold hover:text-plum"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-2 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 font-serif text-2xl text-plum">
            {formatPeso(product.price)}
            {product.compare_at_price && (
              <span className="ml-3 text-base text-charcoal/40 line-through">
                {formatPeso(product.compare_at_price)}
              </span>
            )}
          </p>

          <p className="mt-5 leading-relaxed text-charcoal/80">{product.description}</p>

          <div className="mt-6 rounded-2xl bg-lavender/25 p-5">
            <p className="label-field !mb-2">Gemstones</p>
            <div className="flex flex-wrap gap-2">
              {product.gemstones.map((g) => (
                <Link
                  key={g}
                  href={`/shop?gemstone=${encodeURIComponent(g)}`}
                  className="rounded-full bg-white px-3 py-1 text-xs text-charcoal/80"
                >
                  {g}
                </Link>
              ))}
            </div>
            {product.symbolism && (
              <>
                <p className="label-field mt-4 !mb-2">Traditional Symbolism</p>
                <p className="font-serif text-lg italic leading-relaxed text-charcoal/85">
                  {product.symbolism}
                </p>
              </>
            )}
          </div>

          <div className="mt-7">
            <ProductPurchase
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={image}
              sizes={product.sizes}
              stock={product.stock}
            />
          </div>
        </div>
      </div>

      <ReviewSection
        productId={product.id}
        productName={product.name}
        reviews={reviews}
      />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-heading">You May Also Love</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
