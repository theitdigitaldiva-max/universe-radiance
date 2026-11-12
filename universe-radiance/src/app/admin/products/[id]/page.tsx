import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageManager } from "@/components/admin/ImageManager";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("id", params.id)
      .single(),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();
  const typed = product as Product;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Edit Product</h1>
      <ProductForm product={typed} categories={categories ?? []} />
      <ImageManager
        productId={typed.id}
        images={typed.product_images ?? []}
      />
    </div>
  );
}
