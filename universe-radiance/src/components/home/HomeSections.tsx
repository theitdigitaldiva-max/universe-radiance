import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { GEMSTONE_OPTIONS } from "@/lib/constants";
import { SearchPanel } from "./SearchPanel";

export function SectionHeading({
  eyebrow,
  title,
  center = true,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-heading">{title}</h2>
    </div>
  );
}

export function Intro({ text }: { text: string }) {
  return (
    <section className="container-site py-16 text-center">
      <p className="mx-auto max-w-3xl font-serif text-2xl leading-relaxed text-charcoal/90 sm:text-3xl">
        {text}
      </p>
      <div className="mx-auto mt-6 h-px w-24 bg-gold" />
    </section>
  );
}

export function FeaturedCollections({
  eyebrow,
  title,
  categories,
}: {
  eyebrow: string;
  title: string;
  categories: Category[];
}) {
  return (
    <section className="bg-white py-16">
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={category.image_url ?? "/images/hero-display.jpg"}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-5 text-ivory">
                <h3 className="font-serif text-xl">{category.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-ivory/80">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewArrivalsBestsellers({
  newArrivalsEyebrow,
  newArrivalsHeading,
  bestsellersEyebrow,
  bestsellersHeading,
  newArrivals,
  bestsellers,
}: {
  newArrivalsEyebrow: string;
  newArrivalsHeading: string;
  bestsellersEyebrow: string;
  bestsellersHeading: string;
  newArrivals: React.ReactNode;
  bestsellers: React.ReactNode;
}) {
  return (
    <>
      <section className="container-site py-16">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow={newArrivalsEyebrow} title={newArrivalsHeading} center={false} />
          <Link href="/shop" className="hidden text-sm uppercase tracking-widest text-plum hover:text-charcoal sm:block">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals}
        </div>
      </section>

      <section className="bg-lavender/25 py-16">
        <div className="container-site">
          <div className="flex items-end justify-between">
            <SectionHeading eyebrow={bestsellersEyebrow} title={bestsellersHeading} center={false} />
            <Link href="/shop?sort=price_asc" className="hidden text-sm uppercase tracking-widest text-plum hover:text-charcoal sm:block">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers}
          </div>
        </div>
      </section>
    </>
  );
}

export function ShopSearchFeature({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="container-site py-16">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mx-auto mt-8 max-w-3xl">
        <SearchPanel />
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {GEMSTONE_OPTIONS.slice(0, 8).map((stone) => (
            <Link
              key={stone}
              href={`/shop?gemstone=${encodeURIComponent(stone)}`}
              className="rounded-full border border-lavender bg-white px-4 py-1.5 text-xs uppercase tracking-wider text-plum transition hover:border-plum hover:bg-plum hover:text-ivory"
            >
              {stone}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomizePromo({
  image,
  eyebrow,
  title,
  body,
  buttonText,
  buttonLink,
}: {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <section className="container-site py-16">
      <div className="grid overflow-hidden rounded-3xl bg-plum text-ivory lg:grid-cols-2">
        <div className="relative min-h-[300px]">
          <Image
            src={image || "/images/lifestyle-wrist.jpg"}
            alt="Custom gemstone bracelet"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-10 lg:p-14">
          <p className="section-eyebrow !text-gold">{eyebrow}</p>
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 leading-relaxed text-ivory/85">{body}</p>
          {buttonText && (
            <div className="mt-8">
              <Link href={buttonLink || "/customize"} className="btn-gold">
                {buttonText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function AboutPreview({
  image,
  eyebrow,
  heading,
  body,
  buttonText,
  buttonLink,
}: {
  image: string;
  eyebrow: string;
  heading: string;
  body: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <section className="bg-white py-16">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src={image || "/images/product-crafting.jpg"}
            alt="Handcrafting a Universe Radiance bracelet"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow={eyebrow} title={heading} center={false} />
          <p className="mt-5 leading-relaxed text-charcoal/80">{body}</p>
          {buttonText && (
            <Link href={buttonLink || "/about"} className="btn-outline mt-8">
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_IG_PHOTOS = [
  "/images/product-citrine-carnelian.jpg",
  "/images/product-wrist-aqua.jpg",
  "/images/event-booth.jpg",
  "/images/product-wrist-stack.jpg",
  "/images/product-community.jpg",
  "/images/shop-interior.jpg",
];

export function SocialSection({
  instagram,
  handle,
  photos,
}: {
  instagram: string;
  handle: string;
  photos: string[];
}) {
  const resolved = photos.length > 0 ? photos : DEFAULT_IG_PHOTOS;
  return (
    <section className="container-site py-16 text-center">
      <SectionHeading eyebrow="Follow Along" title={handle || "@universeradiance"} />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {resolved.map((src, i) => (
          <a
            key={src + i}
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt={`Instagram photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 16vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
      <a
        href={instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline mt-8"
      >
        Follow on Instagram
      </a>
    </section>
  );
}
