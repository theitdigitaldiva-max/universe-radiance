"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ShopEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ImageUploadField } from "./ImageUploadField";

export function EventManager({ events }: { events: ShopEvent[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ShopEvent | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    start_time: "",
    end_time: "",
    image_url: "",
    is_published: true,
  });
  const [busy, setBusy] = useState(false);

  const startEdit = (event: ShopEvent) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description ?? "",
      location: event.location ?? "",
      event_date: event.event_date ?? "",
      start_time: event.start_time ?? "",
      end_time: event.end_time ?? "",
      image_url: event.image_url ?? "",
      is_published: event.is_published,
    });
  };

  const reset = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      location: "",
      event_date: "",
      start_time: "",
      end_time: "",
      image_url: "",
      is_published: true,
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const supabase = createClient();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      event_date: form.event_date || null,
      start_time: form.start_time.trim() || null,
      end_time: form.end_time.trim() || null,
      image_url: form.image_url.trim() || null,
      is_published: form.is_published,
    };
    if (editing) {
      await supabase.from("events").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("events").insert(payload);
    }
    setBusy(false);
    reset();
    router.refresh();
  };

  const remove = async (id: string) => {
    const supabase = createClient();
    await supabase.from("events").delete().eq("id", id);
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={save} className="card h-fit space-y-4 p-6">
        <h2 className="font-serif text-xl text-charcoal">{editing ? "Edit Event" : "New Event"}</h2>
        <div>
          <label className="label-field" htmlFor="ev-title">Title *</label>
          <input id="ev-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="ev-desc">Description</label>
          <textarea id="ev-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="ev-loc">Location</label>
          <input id="ev-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field" htmlFor="ev-date">Date</label>
            <input id="ev-date" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="input-field" />
          </div>
          <div>
            <ImageUploadField
              label="Event Photo"
              value={form.image_url}
              folder="events"
              onChange={(url) => setForm({ ...form, image_url: url })}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="ev-start">Start Time</label>
            <input id="ev-start" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} placeholder="3:00 PM" className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="ev-end">End Time</label>
            <input id="ev-end" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} placeholder="9:00 PM" className="input-field" />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal/80">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 accent-plum" />
          Published on the website
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="btn-primary !py-2 text-xs">
            {busy ? "Saving..." : editing ? "Save Changes" : "Add Event"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="btn-outline !py-2 text-xs">Cancel</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="card flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium text-charcoal">{event.title}</p>
              <p className="text-sm text-charcoal/60">
                {formatDate(event.event_date)}
                {event.location ? ` · ${event.location}` : ""}
              </p>
              <span className={`badge mt-2 ${event.is_published ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                {event.is_published ? "Published" : "Hidden"}
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(event)} className="text-xs uppercase tracking-wider text-plum hover:underline">Edit</button>
              <button onClick={() => remove(event.id)} className="text-xs uppercase tracking-wider text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="card py-10 text-center text-charcoal/50">No events yet.</div>
        )}
      </div>
    </div>
  );
}
