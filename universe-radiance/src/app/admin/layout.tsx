import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { isAdminUser } from "@/lib/admin";

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

  if (user && !isAdminUser(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lavender/15 px-4">
        <div className="card max-w-md p-8 text-center">
          <h1 className="font-serif text-2xl text-charcoal">No admin access</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            The account <strong>{user.email}</strong> is not an admin. Log out
            and sign in with an admin account.
          </p>
          <SignOutButton />
        </div>
      </div>
    );
  }

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
