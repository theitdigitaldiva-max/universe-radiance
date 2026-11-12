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

  return (
    <>
      <Hero
        title={content["hero_title"] ?? "Every Season Has a Story"}
        subtitle={
          content["hero_subtitle"] ??
          "Personalized gemstone designs that align with your intention, purpose, and well-being."
        }
      />

      <Intro
        subtitle={
          content["hero_subtitle"] ??
          "Personalized gemstone designs that align with your intention, purpose, and well-being."
        }
      />

      <FeaturedCollections categories={categories} />

      <ShopSearchFeature />

      <NewArrivalsBestsellers
        newArrivals={
          newArrivals.length > 0
            ? newArrivals.map((p) => <ProductCard key={p.id} product={p} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)
        }
        bestsellers={bestsellers.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      />

      <CustomizePromo />

      <AboutPreview
        heading={content["about_heading"] ?? "Beyond the craft lies its true meaning"}
        body={
          content["about_body"] ??
          "Universe Radiance creates personalized gemstone designs that align with your intention, purpose, and enhance well-being."
        }
      />

      <TestimonialsSection testimonials={testimonials} />

      <EventsPreview events={events} />

      <ContactCta
        email={content["contact_email"] ?? ""}
        phone={content["contact_phone"] ?? ""}
      />

      <SocialSection
        instagram={content["instagram_url"] ?? "https://www.instagram.com/universeradiance"}
      />
    </>
  );
}
