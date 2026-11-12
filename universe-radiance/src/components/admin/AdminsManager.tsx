"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_you: boolean;
  is_superadmin: boolean;
};

export function AdminsManager({
  notifyEmail,
  superadminEmail,
}: {
  notifyEmail: string;
  superadminEmail: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [notify, setNotify] = useState(notifyEmail);
  const [notifyBusy, setNotifyBusy] = useState(false);
  const [notifySaved, setNotifySaved] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin-users");
    if (res.status === 403) {
      setForbidden(true);
      setLoaded(true);
      return;
    }
    if (!res.ok) {
      setError("Admin management is not connected yet — the SERVICE ROLE key still needs to be added in Vercel. Ask me for the setup step.");
      setLoaded(true);
      return;
    }
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoaded(true);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const res = await fetch("/api/admin-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not add the admin.");
      return;
    }
    setNotice(`Admin ${form.email.trim().toLowerCase()} added — they can log in at /admin/login.`);
    setForm({ email: "", password: "" });
    await load();
  };

  const removeAdmin = async (user: AdminUser) => {
    if (user.is_superadmin) return;
    if (!window.confirm(`Remove admin access for ${user.email}? They will no longer be able to log in.`)) return;
    const res = await fetch(`/api/admin-users?id=${encodeURIComponent(user.id)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not delete that account.");
      return;
    }
    setNotice(`${user.email} removed.`);
    await load();
  };

  const saveNotifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifyBusy(true);
    setNotifySaved(false);
    const supabase = createClient();
    await supabase
      .from("site_content")
      .upsert({ key: "notify_email", value: notify.trim() });
    setNotifyBusy(false);
    setNotifySaved(true);
    router.refresh();
  };

  if (forbidden) {
    return (
      <div className="card p-8 text-center">
        <p className="font-medium text-charcoal">Only the super admin can manage admin accounts.</p>
        <p className="mt-1 text-sm text-charcoal/55">
          Log in as {superadminEmail} to add or remove admins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-2xl text-charcoal">Admin Accounts</h2>
        <p className="mt-1 mb-5 text-sm text-charcoal/55">
          Admins can manage products, orders, content, and inquiries. Only you
          (the super admin) can add or remove admins — your own account cannot
          be deleted.
        </p>

        <form onSubmit={addAdmin} className="card mb-6 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="label-field" htmlFor="adm-email">New admin email *</label>
            <input
              id="adm-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="owner@gmail.com"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="adm-pass">Temporary password *</label>
            <input
              id="adm-pass"
              type="text"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
              {busy ? "Adding..." : "+ Add Admin"}
            </button>
          </div>
          <p className="text-xs text-charcoal/45 sm:col-span-3">
            Send the email and password to the new admin privately (e.g. Messenger). They log in at{" "}
            <strong>/admin/login</strong>. The password is only used to create the account — it is not stored or shown again.
          </p>
        </form>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {notice && <p className="mb-4 text-sm text-emerald-700">{notice}</p>}

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="card flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium text-charcoal">{user.email}</p>
                <p className="text-sm text-charcoal/55">
                  Added {new Date(user.created_at).toLocaleDateString()}
                  {user.last_sign_in_at
                    ? ` · Last login ${new Date(user.last_sign_in_at).toLocaleDateString()}`
                    : " · Never logged in yet"}
                </p>
                {user.is_superadmin && (
                  <span className="badge mt-2 inline-block bg-gold/25 text-charcoal">
                    Super admin — cannot be deleted
                  </span>
                )}
              </div>
              {!user.is_superadmin && (
                <button
                  onClick={() => removeAdmin(user)}
                  className="text-xs uppercase tracking-wider text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {!loaded && <div className="card py-8 text-center text-charcoal/50">Loading accounts...</div>}
          {loaded && users.length === 0 && (
            <div className="card py-8 text-center text-charcoal/50">No admin accounts found.</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-charcoal">Notification Email</h2>
        <p className="mt-1 mb-5 text-sm text-charcoal/55">
          Where inquiry, custom-order, and order emails are sent. Set this to
          your Gmail (or the owner’s Gmail) so messages from the website land
          in the right inbox.
        </p>
        <form onSubmit={saveNotifyEmail} className="card flex flex-wrap items-end gap-4 p-5">
          <div className="min-w-64 flex-1">
            <label className="label-field" htmlFor="notify-email">Notification Gmail</label>
            <input
              id="notify-email"
              type="email"
              required
              value={notify}
              onChange={(e) => setNotify(e.target.value)}
              className="input-field"
              placeholder={superadminEmail}
            />
          </div>
          <button type="submit" disabled={notifyBusy} className="btn-primary">
            {notifyBusy ? "Saving..." : "Save"}
          </button>
          {notifySaved && <span className="text-sm text-emerald-700">Saved ✓</span>}
        </form>
      </section>
    </div>
  );
}
