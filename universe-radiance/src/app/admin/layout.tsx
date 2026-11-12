import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteContent } from "@/lib/data";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: {
    default: "Universe Radiance — Every Season Has a Story",
    template: "%s | Universe Radiance",
  },
  description:
    "Personalized gemstone jewelry and handmade bracelets designed around your intention, purpose, and well-being.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <CartProvider>
          <AnnouncementBar text={content["announcement_text"] ?? ""} />
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer content={content} />
        </CartProvider>
      </body>
    </html>
  );
}
