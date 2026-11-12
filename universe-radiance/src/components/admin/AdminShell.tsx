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

export function AdminShell({
  children,
  email,
  badges = {},
}: {
  children: React.ReactNode;
  email: string;
  badges?: Record<string, number | null>;
}) {
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

  const nav = (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        const badge = badges[link.href];
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center justify-between rounded-lg px-4 py-2.5 text-sm transition",
              active
                ? "bg-plum font-medium text-ivory"
                : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
            )}
          >
            <span>{link.label}</span>
            {badge ? (
              <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-charcoal">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarFooter = (
    <div className="space-y-3 border-t border-ivory/10 px-4 py-4">
      <Link
        href="/"
        className="block text-xs uppercase tracking-widest text-gold hover:text-ivory"
      >
        View my website ↗
      </Link>
      <button
        onClick={logout}
        className="w-full rounded-lg border border-ivory/25 px-4 py-2 text-xs uppercase tracking-widest text-ivory/80 transition hover:bg-ivory hover:text-charcoal"
      >
        Log out
      </button>
    </div>
  );

  const brand = (
    <div className="border-b border-ivory/10 px-5 py-5">
      <p className="font-serif text-xl leading-tight text-ivory">Universe Radiance</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.3em] text-gold">Admin Panel</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-lavender/15">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-charcoal lg:flex">
        {brand}
        <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
        <div className="px-3 pb-1 text-center text-[11px] text-ivory/40">{email}</div>
        {sidebarFooter}
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 bg-charcoal px-4 lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="rounded border border-ivory/30 p-1.5"
          aria-label="Toggle admin menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-ivory">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div>
          <p className="font-serif text-base leading-tight text-ivory">Universe Radiance</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Admin Panel</p>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-charcoal">
            {brand}
            <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
            <div className="px-3 pb-1 text-center text-[11px] text-ivory/40">{email}</div>
            {sidebarFooter}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
