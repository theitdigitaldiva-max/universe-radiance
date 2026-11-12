export function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={n <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          className={className}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
