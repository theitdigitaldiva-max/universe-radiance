import { createClient } from "@/lib/supabase/server";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { TestimonialManager } from "@/components/admin/TestimonialManager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Site Content" };

export default async function AdminContentPage() {
  const supabase = createClient();
  const [{ data: contentRows }, { data: testimonials }] = await Promise.all([
    supabase.from("site_content").select("key, value"),
    supabase.from("testimonials").select("*").order("sort_order", { ascending: true }),
  ]);

  const content: Record<string, string> = {};
  (contentRows ?? []).forEach((row: { key: string; value: string }) => {
    content[row.key] = row.value;
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="mb-1 font-serif text-3xl text-charcoal">Site Content</h1>
        <p className="mb-6 text-sm text-charcoal/60">
          Edit every section of the homepage — announcement bar, hero banner,
          headings, the custom-order banner, Our Story, contact banner, and the
          Instagram photo grid. Upload photos, change button text, and set
          where each button links. Everything goes live immediately.
        </p>
        <ContentEditor content={content} />
      </section>

      <section>
        <h2 className="mb-6 font-serif text-2xl text-charcoal">Testimonials</h2>
        <TestimonialManager testimonials={testimonials ?? []} />
      </section>
    </div>
  );
}
