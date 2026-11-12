import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getTestimonials } from "@/lib/data";
import { TestimonialsSection } from "@/components/home/Community";
import { Stars } from "@/components/ui/Stars";

export const metadata: Metadata = { title: "About" };

export const dynamic = "force-dynamic";

const VALUES = [
  {
    title: "Intentional",
    body: "Every design starts with a purpose — the season you are in and the story you are writing.",
  },
  {
    title: "Handcrafted",
    body: "Each piece is strung by hand in small batches, never mass-produced.",
  },
  {
    title: "Meaningful",
    body: "Traditional gemstone symbolism guides every combination we create.",
  },
  {
    title: "Personal",
    body: "From pop-up booths to custom orders, we get to know the person behind the bracelet.",
  },
];

export default async function AboutPage() {
  const content = await getSiteContent();
  const testimonials = await getTestimonials();

  return (
    <div>
      <section className="container-site py-14 text-center">
        <p className="section-eyebrow">About Universe Radiance</p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
          {content["about_heading"] ?? "Beyond the craft of each beautiful piece lies its true meaning"}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-charcoal/75">
          {content["about_body"] ?? ""}
        </p>
      </section>

      <section className="container-site grid gap-6 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <div key={value.title} className="card p-7">
            <div className="mb-4 h-1 w-10 bg-gold" />
            <h2 className="font-serif text-xl text-charcoal">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{value.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-white py-14">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src="/images/product-crafting.jpg" alt="Crafting a bracelet" fill className="object-cover" sizes="50vw" />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src="/images/shop-interior.jpg" alt="Pop-up boutique display" fill className="object-cover" sizes="50vw" />
            </div>
          </div>
          <div>
            <p className="section-eyebrow">From Our Booths to You</p>
            <h2 className="section-heading">A brand born at pop-up markets</h2>
            <p className="mt-5 leading-relaxed text-charcoal/75">
              Universe Radiance began at artisan markets and community events —
              places where we could hear your stories face to face. Whether you
              meet us at a booth like BGC Art Mart or order from this site, the
              experience stays the same: personal, thoughtful, and rooted in
              meaning.
            </p>
            <p className="mt-4 leading-relaxed text-charcoal/75">
              Every bracelet arrives with its gemstones and symbolism explained,
              because knowing the meaning behind your piece is part of the joy.
            </p>
            <Link href="/events" className="btn-outline mt-7">Where to Find Us</Link>
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      <section className="container-site py-14 text-center">
        <div className="flex justify-center">
          <Stars rating={5} className="h-5 w-5" />
        </div>
        <p className="mt-4 font-serif text-2xl italic text-charcoal/80">
          “Every Season Has a Story.”
        </p>
        <Link href="/customize" className="btn-primary mt-6">Begin Your Custom Piece</Link>
      </section>
    </div>
  );
}
