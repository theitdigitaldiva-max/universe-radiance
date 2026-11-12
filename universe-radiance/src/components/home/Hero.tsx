import Image from "next/image";
import Link from "next/link";

export function Hero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <Image
        src="/images/hero-display.jpg"
        alt="Universe Radiance gemstone bracelet collection"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />
      <div className="container-site relative z-10 py-20 text-center text-ivory">
        <p className="section-eyebrow !text-gold">Personalized Gemstone Jewelry</p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/shop" className="btn-gold">
            Shop the Collection
          </Link>
          <Link
            href="/customize"
            className="inline-flex items-center justify-center rounded-full border border-ivory/70 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ivory transition hover:bg-ivory hover:text-charcoal"
          >
            Design Your Own
          </Link>
        </div>
      </div>
    </section>
  );
}
