import Image from "next/image";
import Link from "next/link";

export function Hero({
  image,
  title,
  subtitle,
  button1Text,
  button1Link,
  button2Text,
  button2Link,
}: {
  image: string;
  title: string;
  subtitle: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
}) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <Image
        src={image || "/images/hero-display.jpg"}
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
          {button1Text && (
            <Link href={button1Link || "/shop"} className="btn-gold">
              {button1Text}
            </Link>
          )}
          {button2Text && (
            <Link
              href={button2Link || "/customize"}
              className="inline-flex items-center justify-center rounded-full border border-ivory/70 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ivory transition hover:bg-ivory hover:text-charcoal"
            >
              {button2Text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
