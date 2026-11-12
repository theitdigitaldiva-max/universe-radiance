-- ============================================================
-- UNIVERSE RADIANCE — seed data
-- Run this file SECOND in the Supabase SQL Editor (after schema.sql).
-- Safe to re-run: it only inserts when the slug/key does not exist yet.
-- ============================================================

-- ---------- categories ----------
insert into public.categories (name, slug, description, image_url, sort_order)
values
  ('Signature Bracelets', 'signature-bracelets', 'Hand-strung gemstone bracelets designed around an intention — our everyday pieces.', '/images/hero-display.jpg', 1),
  ('Pearl Collection', 'pearl-collection', 'Freshwater pearls paired with healing stones for soft, timeless elegance.', '/images/product-wrist-stack.jpg', 2),
  ('Rings & Accents', 'rings-accents', 'Wire-wrapped gemstone rings and accent pieces that complete your stack.', '/images/product-citrine-carnelian.jpg', 3),
  ('Limited Editions', 'limited-edition', 'Small-batch designs available only while supplies last.', '/images/product-boxes.jpg', 4)
on conflict (slug) do nothing;

-- ---------- products ----------
with cat as (select id, slug from public.categories)
insert into public.products
  (name, slug, description, gemstones, symbolism, category_id, price, compare_at_price, colors, sizes, stock, status, is_featured, is_new_arrival, is_bestseller)
values
  ('Sunrise Courage — Citrine & Carnelian', 'sunrise-courage-citrine-carnelian',
   'Our signature pairing. Warm citrine meets fiery carnelian in a hand-knotted bracelet finished with gold-tone accents. One of our favorite combinations — made to be worn every day.',
   array['Citrine','Carnelian'], 'Citrine symbolizes happiness and optimism, while carnelian represents courage, passion, and emotional strength.',
   (select id from cat where slug='signature-bracelets'), 1280.00, 1480.00, array['Gold','Orange'],
   array['6.5in','7in','7.5in'], 12, 'active', true, false, true),

  ('Aquamarine Serenity', 'aquamarine-serenity',
   'Cool aquamarine beads with a single carved accent bead, inspired by calm seas and clear thoughts. Strung on durable stretch cord for a comfortable fit.',
   array['Aquamarine'], 'Aquamarine is the stone of calm, clarity, and gentle communication — a breath of fresh air on the wrist.',
   (select id from cat where slug='signature-bracelets'), 1450.00, null, array['Blue'],
   array['6.5in','7in','7.5in'], 8, 'active', true, true, false),

  ('Gentle Heart — Rose Quartz & Pearl', 'gentle-heart-rose-quartz-pearl',
   'Blush rose quartz softened by lustrous freshwater pearls. Feminine, meaningful, and effortlessly elegant.',
   array['Rose Quartz','Freshwater Pearl'], 'Rose quartz opens the heart to love and compassion; pearls bring purity and quiet confidence.',
   (select id from cat where slug='pearl-collection'), 1150.00, null, array['Pink','White'],
   array['6.5in','7in','7.5in'], 10, 'active', false, true, false),

  ('Amethyst Calm', 'amethyst-calm',
   'Deep purple amethyst with lavender accents, hand-selected for rich color. A bedside-to-boardroom staple.',
   array['Amethyst'], 'Amethyst is treasured for peace, balance, and restful sleep — the classic stone of serenity.',
   (select id from cat where slug='signature-bracelets'), 1320.00, null, array['Purple'],
   array['6.5in','7in','7.5in'], 9, 'active', true, false, false),

  ('Freshwater Pearl Classic', 'freshwater-pearl-classic',
   'A single strand of high-luster freshwater pearls, individually knotted. The piece you reach for when nothing should compete with your glow.',
   array['Freshwater Pearl'], 'Pearls symbolize wisdom, integrity, and new beginnings.',
   (select id from cat where slug='pearl-collection'), 1650.00, 1850.00, array['White'],
   array['6.5in','7in','7.5in'], 6, 'active', true, false, true),

  ('Onyx Grounding', 'onyx-grounding',
   'Matte black onyx beads with a single gold-tone spacer. Strong, minimal, and quietly powerful.',
   array['Black Onyx'], 'Black onyx is a stone of grounding, focus, and protection.',
   (select id from cat where slug='signature-bracelets'), 980.00, null, array['Black','Gold'],
   array['6.5in','7in','7.5in'], 14, 'active', false, false, true),

  ('Intention Stack — Mixed Gemstone', 'intention-stack-mixed-gemstone',
   'A curated trio of gemstone bracelets designed to layer: one for courage, one for calm, one for joy. Sold as a set.',
   array['Citrine','Amethyst','Aquamarine','Rose Quartz'], 'Each stone carries its own meaning — together they tell your story.',
   (select id from cat where slug='limited-edition'), 2980.00, 3450.00, array['Gold','Blue','Pink','Purple'],
   array['6.5in','7in','7.5in'], 4, 'active', true, true, false),

  ('Carnelian Wire-Wrapped Ring', 'carnelian-wire-wrapped-ring',
   'A polished carnelian stone wrapped by hand in gold-tone wire. Adjustable, stackable, and full of fire.',
   array['Carnelian'], 'Carnelian fuels creativity, courage, and vitality.',
   (select id from cat where slug='rings-accents'), 780.00, null, array['Orange','Gold'],
   array['Adjustable'], 15, 'active', false, false, false),

  ('Moonstone Glow', 'moonstone-glow',
   'Iridescent moonstone with a soft blue flash, accented with tiny silver-tone beads.',
   array['Moonstone'], 'Moonstone is the stone of intuition, new beginnings, and feminine energy.',
   (select id from cat where slug='limited-edition'), 1420.00, null, array['White','Blue'],
   array['6.5in','7in','7.5in'], 5, 'active', false, true, false),

  ('Aventurine Luck', 'aventurine-luck',
   'Mossy green aventurine beads — the classic stone of opportunity and optimism.',
   array['Green Aventurine'], 'Aventurine attracts luck, prosperity, and a hopeful heart.',
   (select id from cat where slug='signature-bracelets'), 1050.00, null, array['Green'],
   array['6.5in','7in','7.5in'], 11, 'active', false, false, false)
on conflict (slug) do nothing;

-- ---------- product images ----------
with p as (select id, slug from public.products)
insert into public.product_images (product_id, url, alt, sort_order)
values
  ((select id from p where slug='sunrise-courage-citrine-carnelian'), '/images/product-citrine-carnelian.jpg', 'Citrine and carnelian bracelet with wire-wrapped ring', 1),
  ((select id from p where slug='sunrise-courage-citrine-carnelian'), '/images/lifestyle-wrist.jpg', 'Citrine and carnelian bracelet worn on the wrist', 2),
  ((select id from p where slug='aquamarine-serenity'), '/images/product-wrist-aqua.jpg', 'Aquamarine bracelet worn on the wrist', 1),
  ((select id from p where slug='aquamarine-serenity'), '/images/product-wrist-stack.jpg', 'Aquamarine beads on a display cushion', 2),
  ((select id from p where slug='gentle-heart-rose-quartz-pearl'), '/images/product-wrist-stack.jpg', 'Rose quartz and pearl bracelet on a cushion', 1),
  ((select id from p where slug='gentle-heart-rose-quartz-pearl'), '/images/product-boxes.jpg', 'Bracelets arranged in a wooden display box', 2),
  ((select id from p where slug='amethyst-calm'), '/images/product-boxes.jpg', 'Amethyst bracelets in a display box', 1),
  ((select id from p where slug='amethyst-calm'), '/images/hero-display.jpg', 'Universe Radiance bracelet collection display', 2),
  ((select id from p where slug='freshwater-pearl-classic'), '/images/product-wrist-stack.jpg', 'Freshwater pearl bracelet close-up', 1),
  ((select id from p where slug='freshwater-pearl-classic'), '/images/product-crafting.jpg', 'Handcrafted bracelet worn by the maker', 2),
  ((select id from p where slug='onyx-grounding'), '/images/product-boxes.jpg', 'Dark gemstone bracelets in display box', 1),
  ((select id from p where slug='intention-stack-mixed-gemstone'), '/images/hero-display.jpg', 'Curated gemstone bracelet collection', 1),
  ((select id from p where slug='intention-stack-mixed-gemstone'), '/images/shop-interior.jpg', 'Universe Radiance pop-up display', 2),
  ((select id from p where slug='carnelian-wire-wrapped-ring'), '/images/product-citrine-carnelian.jpg', 'Wire-wrapped carnelian ring', 1),
  ((select id from p where slug='moonstone-glow'), '/images/product-wrist-stack.jpg', 'Pale gemstone bracelet detail', 1),
  ((select id from p where slug='aventurine-luck'), '/images/product-boxes.jpg', 'Green aventurine bracelets in display box', 1)
where exists (select 1 from p);

-- ---------- testimonials ----------
insert into public.testimonials (author_name, location, quote, rating, sort_order)
values
  ('Kathleen V.', 'Taguig', 'My citrine bracelet arrived beautifully packaged with a handwritten note about the stones'' meaning. I haven''t taken it off since.', 5, 1),
  ('Riza M.', 'Makati', 'She listened to what I was going through and designed a custom stack around it. Every piece feels personal.', 5, 2),
  ('Angelica P.', 'Pasig', 'Elegant pieces, fair prices, and the craftsmanship is obvious. The pearls are my everyday signature now.', 5, 3)
on conflict do nothing;

-- ---------- events ----------
insert into public.events (title, description, location, event_date, start_time, end_time, image_url)
values
  ('BGC Art Mart — Booth Pop-Up', 'Visit our booth for handcrafted gemstone bracelets and find a piece that speaks to your story.', '26th Street, corner 9th Ave., Taguig', '2026-10-24', '3:00 PM', '9:00 PM', '/images/event-booth.jpg'),
  ('Rotary Event Showcase', 'Universe Radiance at the Rotary Event — grateful to be part of this community celebration.', 'Philippine Rotary Event Venue', '2026-10-21', '10:00 AM', '4:00 PM', '/images/event-booth-2.jpg')
on conflict do nothing;

-- ---------- approved reviews ----------
with p as (select id, slug from public.products)
insert into public.reviews (product_id, author_name, rating, title, body, approved)
values
  ((select id from p where slug='sunrise-courage-citrine-carnelian'), 'Jasmine', 5, 'My favorite combination', 'The colors are even prettier in person and the meaning behind the stones makes it so special. One of my favorite combinations, truly.'),
  ((select id from p where slug='freshwater-pearl-classic'), 'Camille', 5, 'Timeless', 'The pearls are gorgeous and the knotting feels so well made. Worth every peso.')
on conflict do nothing;

-- ---------- site content ----------
insert into public.site_content (key, value) values
  ('announcement_text', 'Handcrafted in small batches — free gift wrapping on every order'),
  ('hero_title', 'Every Season Has a Story'),
  ('hero_subtitle', 'Personalized gemstone designs that align with your intention, purpose, and well-being.'),
  ('about_heading', 'Beyond the craft of each beautiful piece lies its true meaning'),
  ('about_body', 'Universe Radiance creates personalized gemstone designs that align with your intention, purpose, and enhance well-being. Each bracelet is hand-strung in small batches, combining traditional gemstone symbolism with modern, minimalist design. From our pop-up booths to your wrist — every piece carries a story.'),
  ('contact_email', 'universeradiance@gmail.com'),
  ('contact_phone', '+63 917 000 0000'),
  ('instagram_url', 'https://www.instagram.com/universeradiance'),
  ('facebook_url', 'https://www.facebook.com/universeradiance'),
  ('shipping_note', 'Orders are confirmed personally via email or SMS before payment. No online payment on this site — we arrange GCash/bank transfer or meet-up after confirming your order.')
on conflict (key) do nothing;
