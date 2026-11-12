import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-site py-10">
      <h1 className="section-heading mb-8">Order Request</h1>
      <CheckoutForm />
    </div>
  );
}
