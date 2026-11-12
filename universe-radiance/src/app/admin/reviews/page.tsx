import { createClient } from "@/lib/supabase/server";
import { ReviewManager } from "@/components/admin/ReviewManager";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, products(name)")
    .order("approved", { ascending: true })
    .order("created_at", { ascending: false });

  const reviews: Review[] = (data ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ products, ...review }: { products?: { name: string } } & Review) => review as Review
  );

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Reviews</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Reviews submitted by customers appear on product pages after you approve them.
      </p>
      <div className="mt-6">
        <ReviewManager reviews={reviews} />
      </div>
    </div>
  );
}
