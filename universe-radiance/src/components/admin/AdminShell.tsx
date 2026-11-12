"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/custom-requests", label: "Custom Requests" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/content", label: "Site Content" },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-lavender/15">
      <header className="sticky top-0 z-30 border-b border-lavender/60 bg-charcoal text-ivory">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="rounded border border-ivory/30 p-1.5 lg:hidden"
              aria-label="Toggle admin menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <Link href="/admin" className="font-serif text-lg">Universe Radiance Admin</Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hidden text-ivory/70 hover:text-gold sm:block">View Store →</Link>
            <span className="hidden text-ivory/50 md:block">{email}</span>
            <button onClick={logout} className="rounded-full border border-ivory/40 px-4 py-1.5 text-xs uppercase tracking-widest hover:bg-ivory hover:text-charcoal">
              Log out
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-ivory/10 px-4 py-2 lg:hidden">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block border-b border-ivory/10 py-2.5 text-sm",
                  pathname === link.href ? "text-gold" : "text-ivory/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-site">
        <aside className="hidden w-56 shrink-0 py-6 lg:block">
          <nav className="sticky top-20 space-y-1 px-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-lg px-4 py-2.5 text-sm",
                  pathname === link.href
                    ? "bg-plum font-medium text-ivory"
                    : "text-charcoal/75 hover:bg-lavender/40"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
