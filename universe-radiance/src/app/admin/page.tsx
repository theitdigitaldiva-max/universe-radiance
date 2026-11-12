import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, Td, Th } from "@/components/admin/ui";
import { formatPeso, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: productCount },
    { count: activeProductCount },
    { count: pendingOrders },
    { count: newInquiries },
    { count: newCustomRequests },
    { count: pendingReviews },
    { data: paidOrders },
    { data: recentOrders },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("customization_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
    supabase.from("orders").select("total").eq("payment_status", "paid").neq("status", "cancelled"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const revenue = (paidOrders ?? []).reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0);

  const stats = [
    { label: "Products", value: productCount ?? 0, sub: `${activeProductCount ?? 0} active`, href: "/admin/products" },
    { label: "Pending Orders", value: pendingOrders ?? 0, sub: "awaiting confirmation", href: "/admin/orders" },
    { label: "New Inquiries", value: newInquiries ?? 0, sub: "unread messages", href: "/admin/inquiries" },
    { label: "Custom Requests", value: newCustomRequests ?? 0, sub: "new design requests", href: "/admin/custom-requests" },
    { label: "Reviews to Approve", value: pendingReviews ?? 0, sub: "pending moderation", href: "/admin/reviews" },
    { label: "Collected Revenue", value: formatPeso(revenue), sub: "paid orders", href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-5 transition hover:shadow-md">
            <p className="text-xs uppercase tracking-widest text-charcoal/50">{stat.label}</p>
            <p className="mt-2 font-serif text-3xl text-charcoal">{stat.value}</p>
            <p className="mt-1 text-xs text-plum">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <div className="flex items-center justify-between border-b border-lavender/40 px-5 py-4">
            <h2 className="font-serif text-xl text-charcoal">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-plum hover:text-charcoal">
              View all →
            </Link>
          </div>
          <table className="w-full">
            <thead className="bg-lavender/15">
              <tr><Th>Order</Th><Th>Customer</Th><Th>Total</Th><Th>Status</Th></tr>
            </thead>
            <tbody className="divide-y divide-lavender/30">
              {(recentOrders ?? []).map((order) => (
                <tr key={order.id}>
                  <Td className="font-medium">{order.order_number}</Td>
                  <Td>{order.customer_name}</Td>
                  <Td>{formatPeso(Number(order.total))}</Td>
                  <Td><StatusBadge status={order.status} /></Td>
                </tr>
              ))}
              {recentOrders?.length === 0 && (
                <tr><Td colSpan={4} className="py-8 text-center text-charcoal/50">No orders yet</Td></tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="card">
          <div className="flex items-center justify-between border-b border-lavender/40 px-5 py-4">
            <h2 className="font-serif text-xl text-charcoal">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs uppercase tracking-widest text-plum hover:text-charcoal">
              View all →
            </Link>
          </div>
          <table className="w-full">
            <thead className="bg-lavender/15">
              <tr><Th>Date</Th><Th>Name</Th><Th>Subject</Th><Th>Status</Th></tr>
            </thead>
            <tbody className="divide-y divide-lavender/30">
              {(recentInquiries ?? []).map((inquiry) => (
                <tr key={inquiry.id}>
                  <Td>{formatDate(inquiry.created_at.slice(0, 10))}</Td>
                  <Td>{inquiry.name}</Td>
                  <Td className="max-w-[180px] truncate">{inquiry.subject ?? "—"}</Td>
                  <Td><StatusBadge status={inquiry.status} /></Td>
                </tr>
              ))}
              {recentInquiries?.length === 0 && (
                <tr><Td colSpan={4} className="py-8 text-center text-charcoal/50">No inquiries yet</Td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
