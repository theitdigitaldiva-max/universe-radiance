import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "./ContactForm";
import { getSiteContent } from "@/lib/data";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact" };

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getSiteContent();
  const email = content["contact_email"] ?? "universeradiance@gmail.com";
  const phone = content["contact_phone"] ?? "";
  const instagram = content["instagram_url"] ?? BRAND.instagram;
  const facebook = content["facebook_url"] ?? BRAND.facebook;

  return (
    <div>
      <section className="relative flex min-h-[35vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/event-booth.jpg"
          alt="Universe Radiance booth"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="container-site relative z-10 py-14 text-center text-ivory">
          <p className="section-eyebrow !text-gold">Get in Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl">We Would Love to Hear From You</h1>
        </div>
      </section>

      <section className="container-site grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="section-heading mb-6">Send an Inquiry</h2>
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="label-field !mb-2">Email</p>
            <a href={`mailto:${email}`} className="font-serif text-lg text-charcoal hover:text-plum">
              {email}
            </a>
            {phone && (
              <>
                <p className="label-field mt-5 !mb-2">Phone</p>
                <p className="font-serif text-lg text-charcoal">{phone}</p>
              </>
            )}
          </div>
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="label-field !mb-2">Follow Along</p>
            <div className="flex flex-col gap-2 text-charcoal">
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-plum">
                Instagram — @universeradiance
              </a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-plum">
                Facebook — Universe Radiance
              </a>
            </div>
          </div>
          <div className="rounded-3xl bg-lavender/25 p-7">
            <p className="label-field !mb-2">How Ordering Works</p>
            <p className="text-sm leading-relaxed text-charcoal/75">
              {content["shipping_note"] ??
                "Orders are confirmed personally before payment. No online payment on this site."}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
