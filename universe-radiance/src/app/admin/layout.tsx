import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = headers().get("x-pathname") ?? "";

  if (!user && pathname !== "/admin/login") redirect("/admin/login");

  const [{ count: pendingOrders }, { count: newInquiries }, { count: pendingReviews }] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
    ]);

  const badges: Record<string, number | null> = {
    "/admin/orders": pendingOrders,
    "/admin/inquiries": newInquiries,
    "/admin/reviews": pendingReviews,
  };

  return (
    <AdminShell email={user?.email ?? ""} badges={badges}>
      {children}
    </AdminShell>
  );
}
