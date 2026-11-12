import Image from "next/image";
import Link from "next/link";
import type { ShopEvent, Testimonial } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Stars } from "@/components/ui/Stars";
import { SectionHeading } from "./HomeSections";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-lavender/25 py-16">
      <div className="container-site">
        <SectionHeading eyebrow="Kind Words" title="What Our Customers Say" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="card flex flex-col gap-4 p-7">
              <Stars rating={t.rating} />
              <blockquote className="flex-1 font-serif text-lg leading-relaxed text-charcoal/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="text-sm">
                <span className="font-medium text-charcoal">{t.author_name}</span>
                {t.location && <span className="text-charcoal/50"> · {t.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EventsPreview({ events }: { events: ShopEvent[] }) {
  if (events.length === 0) return null;
  return (
    <section className="container-site py-16">
      <div className="flex items-end justify-between">
        <SectionHeading eyebrow="See Us in Person" title="Events & Exhibitions" center={false} />
        <Link href="/events" className="hidden text-sm uppercase tracking-widest text-plum hover:text-charcoal sm:block">
          All events →
        </Link>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {events.slice(0, 2).map((event) => (
          <Link key={event.id} href="/events" className="card group grid sm:grid-cols-3">
            <div className="relative aspect-[4/3] sm:aspect-auto">
              <Image
                src={event.image_url ?? "/images/event-booth.jpg"}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 sm:col-span-2">
              <p className="text-xs uppercase tracking-widest text-gold">
                {formatDate(event.event_date)}
                {event.start_time ? ` · ${event.start_time}` : ""}
              </p>
              <h3 className="mt-2 font-serif text-xl text-charcoal">{event.title}</h3>
              {event.location && (
                <p className="mt-1 text-sm text-charcoal/60">{event.location}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ContactCta({
  eyebrow,
  title,
  body,
  buttonText,
  buttonLink,
  email,
  phone,
}: {
  eyebrow: string;
  title: string;
  body: string;
  buttonText: string;
  buttonLink: string;
  email: string;
  phone: string;
}) {
  return (
    <section className="bg-charcoal py-16 text-ivory">
      <div className="container-site flex flex-col items-center text-center">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="mt-4 max-w-xl text-ivory/75">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {buttonText && (
            <Link href={buttonLink || "/contact"} className="btn-gold">
              {buttonText}
            </Link>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center rounded-full border border-ivory/50 px-6 py-3 text-sm uppercase tracking-widest transition hover:bg-ivory hover:text-charcoal"
            >
              {email}
            </a>
          )}
        </div>
        {phone && <p className="mt-4 text-sm text-ivory/60">{phone}</p>}
      </div>
    </section>
  );
}
