import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-charcoal">Categories</h1>
      <CategoryManager categories={categories ?? []} />
    </div>
  );
}
