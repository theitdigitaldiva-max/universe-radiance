"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Review } from "@/lib/types";
import { Stars } from "@/components/ui/Stars";

export function ReviewSection({
  productId,
  productName,
  reviews: initialReviews,
}: {
  productId: string;
  productName: string;
  reviews: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [form, setForm] = useState({ author_name: "", rating: 5, title: "", body: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      author_name: form.author_name.trim(),
      rating: form.rating,
      title: form.title.trim() || null,
      body: form.body.trim(),
      approved: false,
    });
    if (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } else {
      setStatus("done");
      setMessage("Thank you! Your review will appear once it is approved.");
      setForm({ author_name: "", rating: 5, title: "", body: "" });
    }
  };

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl text-charcoal">Customer Reviews</h2>

      {reviews.length > 0 ? (
        <>
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={Math.round(average)} />
            <span className="text-sm text-charcoal/60">
              {average.toFixed(1)} · {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <Stars rating={review.rating} />
                  <span className="text-xs text-charcoal/50">
                    {new Date(review.created_at).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {review.title && (
                  <h3 className="mt-2 font-medium text-charcoal">{review.title}</h3>
                )}
                <p className="mt-1 text-sm leading-relaxed text-charcoal/80">{review.body}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-plum">
                  — {review.author_name}
                </p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-charcoal/60">
          No reviews yet — be the first to share your experience with{" "}
          {productName}.
        </p>
      )}

      {status === "done" ? (
        <div className="mt-6 rounded-2xl border border-gold bg-gold/10 p-5 text-sm text-charcoal">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl text-charcoal">Write a Review</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field" htmlFor="review-name">Your Name</label>
              <input
                id="review-name"
                required
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="review-rating">Rating</label>
              <select
                id="review-rating"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="input-field"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="label-field" htmlFor="review-title">Review Title (optional)</label>
            <input
              id="review-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="mt-4">
            <label className="label-field" htmlFor="review-body">Your Review</label>
            <textarea
              id="review-body"
              required
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="input-field"
            />
          </div>
          {status === "error" && <p className="mt-3 text-sm text-red-600">{message}</p>}
          <button type="submit" disabled={status === "submitting"} className="btn-primary mt-5">
            {status === "submitting" ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </section>
  );
}
