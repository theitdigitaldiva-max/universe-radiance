export function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-charcoal py-2 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-ivory/90">{text}</p>
    </div>
  );
}
