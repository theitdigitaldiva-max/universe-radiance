import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lavender/20 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-md">
        <p className="text-center font-serif text-2xl text-charcoal">Universe Radiance</p>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.3em] text-gold">Admin Login</p>
        <LoginForm />
      </div>
    </div>
  );
}
