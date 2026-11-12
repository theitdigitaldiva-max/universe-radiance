import { createClient } from "@/lib/supabase/server";
import { EventManager } from "@/components/admin/EventManager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Events" };

export default async function AdminEventsPage() {
  const supabase = createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-charcoal">Events & Exhibitions</h1>
      <EventManager events={events ?? []} />
    </div>
  );
}
