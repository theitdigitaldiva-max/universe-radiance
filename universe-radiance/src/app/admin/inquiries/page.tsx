import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Td, Th } from "@/components/admin/ui";
import { INQUIRY_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Inquiries" };

export default async function AdminInquiriesPage() {
  const supabase = createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Customer Inquiries</h1>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-lavender/15">
            <tr><Th>Date</Th><Th>Name</Th><Th>Contact</Th><Th>Subject</Th><Th>Message</Th><Th>Status</Th></tr>
          </thead>
          <tbody className="divide-y divide-lavender/30">
            {(inquiries ?? []).map((inquiry) => (
              <tr key={inquiry.id}>
                <Td>{formatDate(inquiry.created_at.slice(0, 10))}</Td>
                <Td className="font-medium text-charcoal">{inquiry.name}</Td>
                <Td>
                  <div>{inquiry.email}</div>
                  {inquiry.phone && <div className="text-charcoal/50">{inquiry.phone}</div>}
                </Td>
                <Td>{inquiry.subject ?? "—"}</Td>
                <Td className="max-w-[260px]">
                  <details>
                    <summary className="cursor-pointer truncate text-plum">{inquiry.message.slice(0, 60)}...</summary>
                    <p className="mt-2 whitespace-pre-wrap text-charcoal/80">{inquiry.message}</p>
                  </details>
                </Td>
                <Td>
                  <StatusSelect
                    table="inquiries"
                    id={inquiry.id}
                    current={inquiry.status}
                    options={INQUIRY_STATUSES}
                  />
                </Td>
              </tr>
            ))}
            {inquiries?.length === 0 && (
              <tr><Td colSpan={6} className="py-10 text-center text-charcoal/50">No inquiries yet.</Td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
