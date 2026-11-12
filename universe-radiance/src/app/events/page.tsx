import type { Metadata } from "next";
import Image from "next/image";
import { getEvents } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Events & Exhibitions" };

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container-site py-14">
      <div className="mb-10 text-center">
        <p className="section-eyebrow">See Us in Person</p>
        <h1 className="section-heading">Events & Exhibitions</h1>
        <p className="mx-auto mt-3 max-w-xl text-charcoal/65">
          Find our booth at markets and community events — try pieces on,
          commission custom work, and say hello.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center">
          <p className="font-serif text-2xl text-charcoal">No upcoming events listed yet</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Follow us on Instagram for the latest booth announcements.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className="card group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={event.image_url ?? "/images/event-booth.jpg"}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">
                  {formatDate(event.event_date)}
                  {event.start_time && ` · ${event.start_time}`}
                  {event.end_time ? ` – ${event.end_time}` : ""}
                </p>
                <h2 className="mt-2 font-serif text-2xl text-charcoal">{event.title}</h2>
                {event.location && (
                  <p className="mt-1 text-sm text-charcoal/60">{event.location}</p>
                )}
                {event.description && (
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                    {event.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
