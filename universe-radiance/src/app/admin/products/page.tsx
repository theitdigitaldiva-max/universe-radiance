import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton, StatusBadge, Td, Th } from "@/components/admin/ui";
import { formatPeso } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage Products" };

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name), product_images(url, sort_order)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-charcoal">Products</h1>
        <Link href="/admin/products/new" className="btn-primary !py-2 text-xs">+ New Product</Link>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-lavender/15">
            <tr>
              <Th>Product</Th><Th>Category</Th><Th>Price</Th><Th>Stock</Th><Th>Flags</Th><Th>Status</Th><Th></Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lavender/30">
            {(products ?? []).map((product) => {
              const image = [...(product.product_images ?? [])].sort(
                (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
              )[0];
              return (
                <tr key={product.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-lavender/20">
                        {image && (
                          <Image src={image.url} alt={product.name} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-charcoal">{product.name}</span>
                    </div>
                  </Td>
                  <Td>{product.category?.name ?? "—"}</Td>
                  <Td>{formatPeso(Number(product.price))}</Td>
                  <Td>{product.stock > 0 ? product.stock : "Made to order"}</Td>
                  <Td>
                    <div className="flex gap-1">
                      {product.is_featured && <span className="badge">Featured</span>}
                      {product.is_new_arrival && <span className="badge">New</span>}
                      {product.is_bestseller && <span className="badge">Bestseller</span>}
                    </div>
                  </Td>
                  <Td><StatusBadge status={product.status} /></Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="text-xs uppercase tracking-wider text-plum hover:underline">
                        Edit
                      </Link>
                      <DeleteButton table="products" id={product.id} />
                    </div>
                  </Td>
                </tr>
              );
            })}
            {products?.length === 0 && (
              <tr><Td colSpan={7} className="py-10 text-center text-charcoal/50">No products yet — create your first one.</Td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
