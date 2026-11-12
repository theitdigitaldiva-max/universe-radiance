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

  return <AdminShell email={user?.email ?? ""}>{children}</AdminShell>;
}
