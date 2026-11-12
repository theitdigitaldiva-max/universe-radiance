export const SUPERADMIN_EMAIL = (
  process.env.SUPERADMIN_EMAIL ?? "theitdigitaldiva@gmail.com"
).toLowerCase();

export function isAdminUser(
  user: { email?: string; app_metadata?: Record<string, unknown> } | null
): boolean {
  if (!user) return false;
  if ((user.email ?? "").toLowerCase() === SUPERADMIN_EMAIL) return true;
  return (user.app_metadata as { role?: string } | undefined)?.role === "admin";
}

export function isSuperadmin(
  user: { email?: string } | null
): boolean {
  return (user?.email ?? "").toLowerCase() === SUPERADMIN_EMAIL;
}
