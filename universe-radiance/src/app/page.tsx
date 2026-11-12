import { ProductCard } from "@/components/shop/ProductCard";
import { Hero } from "@/components/home/Hero";
import {
  AboutPreview,
  CustomizePromo,
  FeaturedCollections,
  Intro,
  NewArrivalsBestsellers,
  ShopSearchFeature,
  SocialSection,
} from "@/components/home/HomeSections";
import {
  ContactCta,
  EventsPreview,
  TestimonialsSection,
} from "@/components/home/Community";
import {
  getBestsellers,
  getCategories,
  getEvents,
  getFeaturedProducts,
  getNewArrivals,
  getSiteContent,
  getTestimonials,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();
  const [categories, featured, newArrivals, bestsellers, testimonials, events] =
    await Promise.all([
      getCategories(),
      getFeaturedProducts(4),
      getNewArrivals(4),
      getBestsellers(4),
      getTestimonials(),
      getEvents(),
    ]);

  const igPhotos = [1, 2, 3, 4, 5, 6]
    .map((n) => content[`ig_photo_${n}`]?.trim() ?? "")
    .filter(Boolean);

  return (
    <>
      <Hero
        image={content["hero_image"] ?? ""}
        title={content["hero_title"] ?? "Every Season Has a Story"}
        subtitle={
          content["hero_subtitle"] ??
          "Personalized gemstone designs that align with your intention, purpose, and well-being."
        }
        button1Text={content["hero_button1_text"] ?? "Shop the Collection"}
        button1Link={content["hero_button1_link"] ?? "/shop"}
        button2Text={content["hero_button2_text"] ?? "Design Your Own"}
        button2Link={content["hero_button2_link"] ?? "/customize"}
      />

      <Intro
        text={
          content["intro_text"] ??
          content["hero_subtitle"] ??
          "Personalized gemstone designs that align with your intention, purpose, and well-being."
        }
      />

      <FeaturedCollections
        eyebrow={content["collections_eyebrow"] ?? "Curated for You"}
        title={content["collections_heading"] ?? "Featured Collections"}
        categories={categories}
      />

      <ShopSearchFeature
        eyebrow={content["search_eyebrow"] ?? "Find Your Stone"}
        title={content["search_heading"] ?? "Search & Discover"}
      />

      <NewArrivalsBestsellers
        newArrivalsEyebrow={content["new_arrivals_eyebrow"] ?? "Just Landed"}
        newArrivalsHeading={content["new_arrivals_heading"] ?? "New Arrivals"}
        bestsellersEyebrow={content["bestsellers_eyebrow"] ?? "Loved by Many"}
        bestsellersHeading={content["bestsellers_heading"] ?? "Bestselling Bracelets"}
        newArrivals={
          newArrivals.length > 0
            ? newArrivals.map((p) => <ProductCard key={p.id} product={p} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)
        }
        bestsellers={bestsellers.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      />

      <CustomizePromo
        image={content["promo_image"] ?? ""}
        eyebrow={content["promo_eyebrow"] ?? "Made Just for You"}
        title={content["promo_title"] ?? "Your story, strung in gemstones"}
        body={
          content["promo_body"] ??
          "Tell us your intention — a season you are in, a goal you are reaching for, a person you are becoming. We will design a custom bracelet around the stones that carry your meaning."
        }
        buttonText={content["promo_button_text"] ?? "Start a Custom Order"}
        buttonLink={content["promo_button_link"] ?? "/customize"}
      />

      <AboutPreview
        image={content["about_image"] ?? ""}
        eyebrow={content["about_eyebrow"] ?? "Our Story"}
        heading={
          content["about_heading"] ??
          "Beyond the craft lies its true meaning"
        }
        body={
          content["about_body"] ??
          "Universe Radiance creates personalized gemstone designs that align with your intention, purpose, and enhance well-being."
        }
        buttonText={content["about_button_text"] ?? "More About Us"}
        buttonLink={content["about_button_link"] ?? "/about"}
      />

      <TestimonialsSection testimonials={testimonials} />

      <EventsPreview events={events} />

      <ContactCta
        eyebrow={content["cta_eyebrow"] ?? "We Would Love to Hear From You"}
        title={content["cta_heading"] ?? "Questions or Custom Requests?"}
        body={
          content["cta_body"] ??
          "Send us a message and we will get back to you personally — usually within a day."
        }
        buttonText={content["cta_button_text"] ?? "Send an Inquiry"}
        buttonLink={content["cta_button_link"] ?? "/contact"}
        email={content["contact_email"] ?? ""}
        phone={content["contact_phone"] ?? ""}
      />

      <SocialSection
        instagram={content["instagram_url"] ?? "https://www.instagram.com/universeradiance"}
        handle={content["instagram_handle"] ?? "@universeradiance"}
        photos={igPhotos}
      />
    </>
  );
}
