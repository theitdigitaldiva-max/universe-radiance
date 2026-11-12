import type { Metadata } from "next";
import Image from "next/image";
import { CustomizeForm } from "./CustomizeForm";

export const metadata: Metadata = {
  title: "Customize Your Bracelet",
};

export default function CustomizePage() {
  return (
    <div>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/product-boxes.jpg"
          alt="Gemstone bracelets in a display box"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="container-site relative z-10 py-16 text-center text-ivory">
          <p className="section-eyebrow !text-gold">Bespoke Orders</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Design Your Own Story</h1>
          <p className="mx-auto mt-4 max-w-xl text-ivory/85">
            Every season has a story — tell us yours, and we will string it in
            gemstones made just for you.
          </p>
        </div>
      </section>

      <section className="container-site max-w-4xl py-14">
        <CustomizeForm />
      </section>
    </div>
  );
}
