"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BRACELET_SIZES, BUDGET_RANGES, GEMSTONE_OPTIONS } from "@/lib/constants";

export function CustomizeForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_gemstones: "",
    bracelet_size: "",
    design_preferences: "",
    budget_range: "",
    additional_instructions: "",
  });
  const [stones, setStones] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleStone = (stone: string) => {
    setStones((prev) =>
      prev.includes(stone) ? prev.filter((s) => s !== stone) : [...prev, stone]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("customization_requests")
      .insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        preferred_gemstones: stones.join(", "),
        bracelet_size: form.bracelet_size || null,
        design_preferences: form.design_preferences.trim() || null,
        budget_range: form.budget_range || null,
        additional_instructions: form.additional_instructions.trim() || null,
      });
    if (insertError) {
      setStatus("error");
      setError("Something went wrong. Please try again or message us on Instagram.");
    } else {
      setStatus("done");
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          data: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            preferred_gemstones: stones.join(", "),
            bracelet_size: form.bracelet_size,
            budget_range: form.budget_range,
            design_preferences: form.design_preferences.trim(),
            additional_instructions: form.additional_instructions.trim(),
          },
        }),
      }).catch(() => {});
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C5A477" strokeWidth="2" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-5 font-serif text-3xl text-charcoal">Request Received</h2>
        <p className="mx-auto mt-3 max-w-md text-charcoal/70">
          Thank you for sharing your story with us. We will reach out within 1–2
          days to discuss your custom piece, suggest stones, and send a quote.
        </p>
        <a href="/shop" className="btn-primary mt-7 inline-flex">Browse Ready-Made Pieces</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="cu-name">Your Name *</label>
          <input id="cu-name" required value={form.name} onChange={set("name")} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="cu-email">Email *</label>
          <input id="cu-email" type="email" required value={form.email} onChange={set("email")} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="cu-phone">Contact Number *</label>
          <input id="cu-phone" required value={form.phone} onChange={set("phone")} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="cu-size">Preferred Bracelet Size</label>
          <select id="cu-size" value={form.bracelet_size} onChange={set("bracelet_size")} className="input-field">
            <option value="">Not sure yet</option>
            {BRACELET_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <span className="label-field">Preferred Gemstones (pick any)</span>
        <div className="flex flex-wrap gap-2">
          {GEMSTONE_OPTIONS.map((stone) => (
            <button
              key={stone}
              type="button"
              onClick={() => toggleStone(stone)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                stones.includes(stone)
                  ? "border-plum bg-plum text-ivory"
                  : "border-lavender bg-white text-charcoal hover:border-plum"
              }`}
            >
              {stone}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="cu-budget">Budget Range</label>
          <select id="cu-budget" value={form.budget_range} onChange={set("budget_range")} className="input-field">
            <option value="">Select a range</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="cu-design">Design Preferences</label>
          <input
            id="cu-design"
            value={form.design_preferences}
            onChange={set("design_preferences")}
            className="input-field"
            placeholder="e.g. dainty, chunky beads, mixed stones, all gold..."
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="label-field" htmlFor="cu-notes">Additional Instructions</label>
        <textarea
          id="cu-notes"
          rows={4}
          value={form.additional_instructions}
          onChange={set("additional_instructions")}
          className="input-field"
          placeholder="Tell us the intention or story behind this piece — a season of life, a milestone, a person..."
        />
      </div>

      {status === "error" && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-7">
        {status === "submitting" ? "Sending..." : "Submit Custom Request"}
      </button>
    </form>
  );
}
