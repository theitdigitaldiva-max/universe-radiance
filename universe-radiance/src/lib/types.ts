export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  gemstones: string[];
  symbolism: string;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  colors: string[];
  sizes: string[];
  stock: number;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  created_at: string;
  category?: Category | null;
  product_images?: ProductImage[];
};

export type Review = {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  approved: boolean;
  created_at: string;
};

export type Testimonial = {
  id: string;
  author_name: string;
  location: string | null;
  quote: string;
  rating: number;
  sort_order: number;
  is_published: boolean;
};

export type ShopEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  image_url: string | null;
  is_published: boolean;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_pickup"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  notes: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  payment_status: "unpaid" | "paid";
  payment_method: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  size: string | null;
  unit_price: number;
  quantity: number;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "replied" | "closed";
  created_at: string;
};

export type CustomizationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_gemstones: string;
  bracelet_size: string | null;
  design_preferences: string | null;
  budget_range: string | null;
  additional_instructions: string | null;
  status: "new" | "in_discussion" | "quoted" | "accepted" | "declined" | "completed";
  created_at: string;
};

export type SiteContentMap = Record<string, string>;

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock: number;
};
