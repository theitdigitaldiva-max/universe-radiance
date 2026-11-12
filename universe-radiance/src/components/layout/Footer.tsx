import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Footer({ content }: { content: Record<string, string> }) {
  const email = content["contact_email"] ?? "universeradiance@gmail.com";
  const phone = content["contact_phone"] ?? "";
  const instagram = content["instagram_url"] ?? BRAND.instagram;
  const facebook = content["facebook_url"] ?? BRAND.facebook;

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">Universe Radiance</p>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gold">
            {BRAND.tagline}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">
            Personalized gemstone jewelry and handmade bracelets, designed
            around your intention, purpose, and well-being.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">Shop</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link href="/shop" className="hover:text-gold">All Bracelets</Link></li>
            <li><Link href="/shop?sort=price_asc" className="hover:text-gold">Shop by Price</Link></li>
            <li><Link href="/customize" className="hover:text-gold">Custom Orders</Link></li>
            <li><Link href="/cart" className="hover:text-gold">Your Cart</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">Company</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/events" className="hover:text-gold">Events & Exhibitions</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/admin" className="hover:text-gold">Admin</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">Get in Touch</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li>{email}</li>
            {phone && <li>{phone}</li>}
            <li className="pt-2">
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="mr-4 hover:text-gold">
                Instagram
              </a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-ivory/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Universe Radiance. All rights reserved.</p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
