import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SUPERADMIN_EMAIL } from "@/lib/admin";

export const dynamic = "force-dynamic";

const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: true, emailed: false });
    }

    let recipients = (process.env.NOTIFY_EMAIL ?? SUPERADMIN_EMAIL)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "notify_email")
        .single();
      const rawValue = data?.value;
      const configured: string[] =
        typeof rawValue === "string"
          ? rawValue
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [];
      if (configured.length > 0) recipients = configured;
    } catch {
      // keep the default
    }

    const type = String(body?.type ?? "inquiry");
    const data = (body?.data ?? {}) as Record<string, string>;

    const titles: Record<string, string> = {
      inquiry: "New inquiry on Universe Radiance",
      custom: "New custom-order request on Universe Radiance",
      order: "New order request on Universe Radiance",
    };
    const title = titles[type] ?? titles.inquiry;

    const fields: Array<[string, string]> =
      type === "order"
        ? [
            ["Order number", data.order_number],
            ["Name", data.customer_name],
            ["Email", data.email],
            ["Phone", data.phone],
            ["Address", data.address],
            ["Notes", data.notes],
            ["Items", data.items],
            ["Total", data.total],
          ]
        : type === "custom"
          ? [
              ["Name", data.name],
              ["Email", data.email],
              ["Phone", data.phone],
              ["Preferred stones", data.preferred_gemstones],
              ["Size", data.bracelet_size],
              ["Budget", data.budget_range],
              ["Design preferences", data.design_preferences],
              ["Instructions", data.additional_instructions],
            ]
          : [
              ["Name", data.name],
              ["Email", data.email],
              ["Phone", data.phone],
              ["Subject", data.subject],
              ["Message", data.message],
            ];

    const rows = fields.map(([label, value]) => row(label, value)).join("");
    const html = `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h1 style="font-size:20px;color:#3d2c3a;margin:0 0 16px;">${title}</h1>
        <table style="border-collapse:collapse;font-size:14px;color:#111827;">${rows}</table>
        <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">
          This message was sent from the Universe Radiance website. Reply directly to the customer's email address above.
        </p>
      </div>`;

    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Universe Radiance <onboarding@resend.dev>",
        to: recipients,
        reply_to: data.email || undefined,
        subject: `${title}${data.subject ? `: ${data.subject}` : ""}`,
        html,
      }),
    });

    return NextResponse.json({
      ok: true,
      emailed: resendResponse.ok,
    });
  } catch {
    return NextResponse.json({ ok: true, emailed: false });
  }
}
