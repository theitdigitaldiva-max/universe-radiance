"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("inquiries").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim(),
    });
    if (insertError) {
      setStatus("error");
      setError("Something went wrong. Please try again or email us directly.");
    } else {
      setStatus("done");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      {status === "done" ? (
        <div className="py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C5A477" strokeWidth="2" className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="mt-4 font-serif text-2xl text-charcoal">Message Sent</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal/65">
            Thank you for reaching out — we will get back to you within a day.
          </p>
          <button onClick={() => setStatus("idle")} className="btn-outline mt-6">
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field" htmlFor="ct-name">Your Name *</label>
              <input id="ct-name" required value={form.name} onChange={set("name")} className="input-field" />
            </div>
            <div>
              <label className="label-field" htmlFor="ct-email">Email *</label>
              <input id="ct-email" type="email" required value={form.email} onChange={set("email")} className="input-field" />
            </div>
            <div>
              <label className="label-field" htmlFor="ct-phone">Contact Number</label>
              <input id="ct-phone" value={form.phone} onChange={set("phone")} className="input-field" />
            </div>
            <div>
              <label className="label-field" htmlFor="ct-subject">Subject</label>
              <input id="ct-subject" value={form.subject} onChange={set("subject")} className="input-field" placeholder="Order, custom piece, event..." />
            </div>
          </div>
          <div>
            <label className="label-field" htmlFor="ct-message">Message *</label>
            <textarea id="ct-message" required rows={5} value={form.message} onChange={set("message")} className="input-field" />
          </div>
          {status === "error" && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={status === "submitting"} className="btn-primary">
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
