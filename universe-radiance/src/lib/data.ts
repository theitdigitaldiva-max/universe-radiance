import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Product,
  Review,
  ShopEvent,
  SiteContentMap,
  Testimonial,
} from "@/lib/types";

export async function getSiteContent(): Promise<SiteContentMap> {
  const supabase = createClient();
  const { data } = await supabase.from("site_content").select("key, value");
  const map: SiteContentMap = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    map[row.key] = row.value;
  });
  return map;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Category[];
}

const PRODUCT_SELECT = "*, category:categories(*), product_images(*)" as const;

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("is_new_arrival", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("is_bestseller", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Product[];
}

export type ShopFilters = {
  category?: string;
  gemstone?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  q?: string;
  sort?: string;
};

export async function getProducts(filters: ShopFilters): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active");

  if (filters.category) {
    query = query.eq("category.slug", filters.category);
  }
  if (filters.gemstone) {
    query = query.contains("gemstones", [filters.gemstone]);
  }
  if (filters.color) {
    query = query.contains("colors", [filters.color]);
  }
  if (filters.minPrice) {
    query = query.gte("price", Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    query = query.lte("price", Number(filters.maxPrice));
  }
  if (filters.availability === "in_stock") {
    query = query.gt("stock", 0);
  } else if (filters.availability === "made_to_order") {
    query = query.eq("stock", 0);
  }
  if (filters.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,description.ilike.%${filters.q}%,symbolism.ilike.%${filters.q}%`
    );
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  return (data as Product) ?? null;
}

export async function getApprovedReviews(productId: string): Promise<Review[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .neq("id", product.id)
    .limit(limit);

  if (product.category_id) {
    query = query.eq("category_id", product.category_id);
  } else {
    query = query.contains("gemstones", product.gemstones.slice(0, 1));
  }

  const { data } = await query;
  return (data ?? []) as Product[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Testimonial[];
}

export async function getEvents(): Promise<ShopEvent[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: false });
  return (data ?? []) as ShopEvent[];
}

export function productImage(product: Product): string {
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return images[0]?.url ?? "/images/hero-display.jpg";
}
