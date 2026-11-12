import { createClient } from "@/lib/supabase/server";
import { AdminsManager } from "@/components/admin/AdminsManager";
import { SUPERADMIN_EMAIL } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "notify_email")
    .single();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-charcoal">Settings</h1>
      <p className="mt-1 mb-8 text-sm text-charcoal/60">
        Manage who has admin access and where website notifications are sent.
      </p>
      <AdminsManager
        notifyEmail={data?.value ?? SUPERADMIN_EMAIL}
        superadminEmail={SUPERADMIN_EMAIL}
      />
    </div>
  );
}
