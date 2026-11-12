-- ============================================================
-- UNIVERSE RADIANCE — database schema
-- Run this file FIRST in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  gemstones text[] not null default '{}',
  symbolism text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2),
  colors text[] not null default '{}',
  sizes text[] not null default '{''6.5in'',''7in'',''7.5in''}',
  stock int not null default 0,
  status text not null default 'active' check (status in ('active','draft','archived')),
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_bestseller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_status_idx on public.products(status);

-- ---------- product images ----------
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0
);

create index if not exists product_images_product_idx on public.product_images(product_id);

-- ---------- orders (order requests — no online payment) ----------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null default '',
  notes text,
  subtotal numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','ready_for_pickup','completed','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid')),
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0)
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- ---------- inquiries ----------
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new','replied','closed')),
  created_at timestamptz not null default now()
);

-- ---------- customization requests ----------
create table if not exists public.customization_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  preferred_gemstones text not null default '',
  bracelet_size text,
  design_preferences text,
  budget_range text,
  additional_instructions text,
  status text not null default 'new' check (status in ('new','in_discussion','quoted','accepted','declined','completed')),
  created_at timestamptz not null default now()
);

-- ---------- reviews (pending approval) ----------
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews(product_id);

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  location text,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- events ----------
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  location text,
  event_date date,
  start_time text,
  end_time text,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- site content (key/value, editable in admin) ----------
create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Storage bucket for product / event images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- ============================================================
-- Row Level Security
-- Public can READ published data. Anyone can SUBMIT orders,
-- inquiries, customization requests and reviews.
-- Any SIGNED-IN user (the owner) can manage everything.
-- ============================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inquiries enable row level security;
alter table public.customization_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.testimonials enable row level security;
alter table public.events enable row level security;
alter table public.site_content enable row level security;

create or replace function public.is_signed_in()
returns boolean language sql stable as
$$ select auth.role() = 'authenticated' $$;

-- categories
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- products
create policy "products public read active" on public.products for select using (status = 'active' or public.is_signed_in());
create policy "products admin write" on public.products for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- product images
create policy "product images public read" on public.product_images for select using (true);
create policy "product images admin write" on public.product_images for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- orders: customer inserts, only admin reads/updates
create policy "orders public insert" on public.orders for insert to anon, authenticated with check (true);
create policy "orders admin all" on public.orders for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

create policy "order items public insert" on public.order_items for insert to anon, authenticated with check (true);
create policy "order items admin all" on public.order_items for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- inquiries
create policy "inquiries public insert" on public.inquiries for insert to anon, authenticated with check (true);
create policy "inquiries admin all" on public.inquiries for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- customization requests
create policy "customization public insert" on public.customization_requests for insert to anon, authenticated with check (true);
create policy "customization admin all" on public.customization_requests for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- reviews: anyone submits, public sees approved only, admin moderates
create policy "reviews public read approved" on public.reviews for select using (approved = true or public.is_signed_in());
create policy "reviews public insert" on public.reviews for insert to anon, authenticated with check (true);
create policy "reviews admin all" on public.reviews for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- testimonials
create policy "testimonials public read" on public.testimonials for select using (is_published = true or public.is_signed_in());
create policy "testimonials admin all" on public.testimonials for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- events
create policy "events public read" on public.events for select using (is_published = true or public.is_signed_in());
create policy "events admin all" on public.events for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- site content
create policy "site content public read" on public.site_content for select using (true);
create policy "site content admin write" on public.site_content for all to authenticated using (public.is_signed_in()) with check (public.is_signed_in());

-- storage: public read, signed-in upload/update/delete
create policy "images public read" on storage.objects for select using (bucket_id = 'images');
create policy "images admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'images');
create policy "images admin update" on storage.objects for update to authenticated using (bucket_id = 'images');
create policy "images admin delete" on storage.objects for delete to authenticated using (bucket_id = 'images');

-- ---------- updated_at trigger ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as
$$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content for each row execute function public.touch_updated_at();
