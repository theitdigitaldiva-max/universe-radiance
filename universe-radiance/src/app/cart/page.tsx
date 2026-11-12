import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="container-site py-10">
      <h1 className="section-heading mb-8">Your Cart</h1>
      <CartView />
    </div>
  );
}
