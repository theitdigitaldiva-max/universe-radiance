import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSuperadmin, SUPERADMIN_EMAIL } from "@/lib/admin";

export const dynamic = "force-dynamic";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function requireSuperadmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isSuperadmin(user)) return null;
  return user;
}

export async function GET() {
  const caller = await requireSuperadmin();
  if (!caller) {
    return NextResponse.json({ error: "Only the super admin can manage admin accounts." }, { status: 403 });
  }

  const service = serviceClient();
  const { data, error } = await service.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    return NextResponse.json({ error: "Could not load admin accounts." }, { status: 500 });
  }

  const users = (data.users ?? [])
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      is_you: u.id === caller.id,
      is_superadmin: (u.email ?? "").toLowerCase() === SUPERADMIN_EMAIL,
    }))
    .sort((a, b) => a.email.localeCompare(b.email));

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const caller = await requireSuperadmin();
  if (!caller) {
    return NextResponse.json({ error: "Only the super admin can manage admin accounts." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid Gmail or email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const service = serviceClient();
  const { error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });

  if (error) {
    const message = error.message.toLowerCase().includes("already")
      ? "That email is already registered."
      : "Could not create the admin account. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const caller = await requireSuperadmin();
  if (!caller) {
    return NextResponse.json({ error: "Only the super admin can manage admin accounts." }, { status: 403 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing account id." }, { status: 400 });
  }
  if (id === caller.id) {
    return NextResponse.json(
      { error: "You cannot delete your own super admin account." },
      { status: 400 }
    );
  }

  const service = serviceClient();
  const { error } = await service.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: "Could not delete that account. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
