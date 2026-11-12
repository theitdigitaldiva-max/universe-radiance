# Universe Radiance

Premium gemstone jewelry e-commerce site — **Every Season Has a Story.**

Built with **Next.js 14 (App Router) · React · TypeScript · Tailwind CSS · Supabase · Vercel**.

## What's inside

**Storefront**
- Homepage: announcement bar, hero, intro, featured collections, search & discover, new arrivals, bestsellers, custom-order promo, about, testimonials, events, contact CTA, Instagram grid, footer
- `/shop` — product listing with filters (category, gemstone, color, price range, availability) + search + sorting
- `/product/[slug]` — gallery, price, description, gemstone symbolism, size & quantity selection, stock status, related products, customer reviews (submit + moderation)
- `/cart` + `/checkout` — order **request** flow. No online payment: orders are confirmed personally (GCash/bank transfer/meet-up arranged off-site)
- `/customize` — bespoke bracelet request form
- `/about`, `/events`, `/contact` — inquiry form

**Admin** (`/admin`, password-protected via Supabase Auth)
- Dashboard with stats (pending orders, inquiries, custom requests, revenue)
- Products: full CRUD, prices, inventory, flags, image upload to Supabase Storage
- Categories, Orders (status + payment tracking + shipping fee), Inquiries, Custom Requests, Reviews moderation, Events, Site Content + Testimonials

## One-time setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a free account, then **New Project** (remember the database password you set).
2. In the project dashboard, click **SQL Editor** (icon in the left sidebar) → **+ New query**.
3. Open `supabase/schema.sql` from this project, copy the entire file, paste into the query editor, click **RUN**.
4. Click **+ New query** again, open `supabase/seed.sql`, copy everything, paste, click **RUN**. (This loads the 10 starter products, categories, testimonials, events, and site text.)
5. Get your API keys: click the gear icon **Project Settings** → **API**.
   - Copy the **Project URL** (looks like `https://abcdefghij.supabase.co`)
   - Copy the **anon public** key (long string under "Project API keys")
6. Create your admin login: click **Authentication** in the left sidebar → **Add user** → **Create new user**. Enter the email and password you want for `/admin`. Click **Create user**.

## One-time setup (Vercel deploy)

1. Push this folder to a **GitHub** repository (private is fine).
2. Go to [vercel.com](https://vercel.com) and sign in with the same account you already use.
3. Click **Add New...** → **Project** → **Import** the GitHub repository.
4. Vercel auto-detects Next.js — no build settings to change.
5. Before deploying, open **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL from step 5 above
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon public key
6. Click **Deploy**. First build takes ~2 minutes.
7. Your site is live at `https://your-project.vercel.app`. In **Settings → Domains** you can add a custom domain later.

## Local development (on a machine with Node.js)

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

Open http://localhost:3000 — the storefront works immediately with your Supabase data.

## Day-to-day use

- **Manage the store:** visit `your-site.vercel.app/admin` and log in with the user you created in step 6.
- **Edit anything:** announcement bar, hero text, about copy, contact details → Admin → Site Content.
- **Add products:** Admin → Products → New Product → upload photos from your device.
- **New order request:** appears in Admin → Orders → open it, set status, add shipping fee, mark paid, record payment method.
- **Customer messages:** Admin → Inquiries. **Bespoke requests:** Admin → Custom Requests.

## Notes

- Product/order photos seeded under `public/images` are cropped from your Instagram posts and can be replaced via the admin image uploader.
- Row Level Security is enabled: visitors can read the catalog and submit orders/reviews/messages, but only your signed-in admin account can manage data.
