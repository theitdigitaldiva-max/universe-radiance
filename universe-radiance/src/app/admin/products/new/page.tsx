import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl text-charcoal">New Product</h1>
      <ProductForm product={null} categories={categories ?? []} />
    </div>
  );
}
