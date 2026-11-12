import type { Metadata } from "next";
import { FilterPanel, type FilterValues } from "@/components/shop/FilterPanel";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
};

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

const asString = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] ?? "" : v ?? "";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters: FilterValues = {
    category: asString(searchParams.category),
    gemstone: asString(searchParams.gemstone),
    color: asString(searchParams.color),
    minPrice: asString(searchParams.minPrice),
    maxPrice: asString(searchParams.maxPrice),
    availability: asString(searchParams.availability),
    sort: asString(searchParams.sort),
    q: asString(searchParams.q),
  };

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(filters),
  ]);

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="container-site py-10">
      <div className="mb-8 text-center">
        <p className="section-eyebrow">The Collection</p>
        <h1 className="section-heading">Shop Gemstone Bracelets</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
          {hasFilters ? " matching your filters" : " in the collection"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <FilterPanel categories={categories} initial={filters} />
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center">
              <p className="font-serif text-2xl text-charcoal">No pieces found</p>
              <p className="mt-2 text-sm text-charcoal/60">
                Try adjusting your filters, or explore a custom order instead.
              </p>
              <a href="/customize" className="btn-outline mt-6">Request a Custom Piece</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
