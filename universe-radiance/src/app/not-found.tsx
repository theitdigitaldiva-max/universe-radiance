import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center py-24 text-center">
      <p className="font-serif text-7xl text-plum">404</p>
      <h1 className="mt-4 font-serif text-2xl text-charcoal">This page has wandered off</h1>
      <p className="mt-2 max-w-sm text-sm text-charcoal/60">
        The page you are looking for does not exist — but your next favorite
        bracelet might.
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/" className="btn-primary">Back to Home</Link>
        <Link href="/shop" className="btn-outline">Browse the Shop</Link>
      </div>
    </div>
  );
}
