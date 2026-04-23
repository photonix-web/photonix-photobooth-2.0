import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM_ADDRESS =
  Deno.env.get("BOOKING_EMAIL_FROM") ||
  "Photonix Photo Booth <noreply@booking.photonixphotobooth.com>";
const ADMIN_EMAIL = "photonix.biz@gmail.com";

interface BookingPayload {
  bookingNumber: string;
  clientName: string;
  email: string;
  phone: string;
  booth: string;
  packageType: string;
  eventName: string;
  eventDate: string;
  startTime: string;
  venue: string;
  fullAddress: string;
  paxGuest?: string;
  themeMotif?: string;
  backdropColor?: string;
  basePrice: string;
  travelFee: string;
  travelZone: string;
  totalPrice: string;
  paymentMethod?: string;
  submittedAt: string;
  themeFileName?: string | null;
  themeFileUrl?: string | null;
  receiptFileName?: string | null;
  receiptFileUrl?: string | null;
}

const escapeHtml = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const row = (label: string, value?: string | null) =>
  value
    ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;width:40%">${escapeHtml(
        label,
      )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-size:13px">${escapeHtml(
        String(value),
      )}</td></tr>`
    : "";

const buildDetailsTable = (b: BookingPayload) => `
  <table style="width:100%;border-collapse:collapse;background:#fafafa;border:1px solid #eee;border-radius:8px;overflow:hidden">
    ${row("Booking Number", b.bookingNumber)}
    ${row("Client Name", b.clientName)}
    ${row("Email Address", b.email)}
    ${row("Contact Number", b.phone)}
    ${row("Event Type", b.eventName)}
    ${row("Event Date", b.eventDate)}
    ${row("Event Time", b.startTime)}
    ${row("Event Venue", b.venue)}
    ${row("Full Address", b.fullAddress)}
    ${row("Package Selected", `${b.booth} — ${b.packageType}`)}
    ${row("Backdrop Color", b.backdropColor || "—")}
    ${row("Pax / Guest", b.paxGuest || "—")}
    ${row("Theme / Motif", b.themeMotif || "—")}
    ${row("Add-ons (Travel Fee)", `${b.travelFee} (${b.travelZone})`)}
    ${row("Base Price", b.basePrice)}
    ${row("TOTAL QUOTATION", b.totalPrice)}
    ${row("Payment Method", b.paymentMethod || "GCash / UnionBank QR")}
    ${row("Date Submitted", b.submittedAt)}
    ${row("Theme Reference File", b.themeFileName || "—")}
    ${row("Proof of Payment File", b.receiptFileName || "—")}
  </table>`;

const clientHtml = (b: BookingPayload) => `
<!doctype html><html><body style="font-family:Arial,sans-serif;background:#ffffff;color:#111;margin:0;padding:24px">
  <div style="max-width:640px;margin:0 auto">
    <h1 style="color:#111;font-size:22px;letter-spacing:2px;margin:0 0 8px">BOOKING CONFIRMED</h1>
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 16px">
      Hi ${escapeHtml(b.clientName)}, thank you for booking with <strong>Photonix Photo Booth</strong>!
      We have received your booking and your payment has been acknowledged. Your event is officially confirmed. 🎉
    </p>
    <p style="background:#111;color:#fff;display:inline-block;padding:8px 14px;border-radius:6px;font-size:13px;letter-spacing:2px;margin:0 0 20px">
      BOOKING NO. ${escapeHtml(b.bookingNumber)}
    </p>
    <h2 style="font-size:15px;letter-spacing:1px;color:#111;margin:16px 0 8px">YOUR BOOKING DETAILS</h2>
    ${buildDetailsTable(b)}
    <p style="color:#444;font-size:13px;line-height:1.6;margin:20px 0 8px">
      We will reach out via email if there are any questions or clarifications regarding your booking.
    </p>
    <p style="color:#444;font-size:13px;line-height:1.6;margin:0 0 8px">
      For faster replies, you may message our Facebook Page <strong>@photonixbooth</strong> and provide your Booking Number.
    </p>
    <p style="color:#888;font-size:12px;margin-top:24px">— Photonix Photo Booth Team</p>
  </div>
</body></html>`;

const adminHtml = (b: BookingPayload) => `
<!doctype html><html><body style="font-family:Arial,sans-serif;background:#ffffff;color:#111;margin:0;padding:24px">
  <div style="max-width:680px;margin:0 auto">
    <h1 style="color:#111;font-size:20px;letter-spacing:2px;margin:0 0 12px">NEW BOOKING SUBMISSION</h1>
    <p style="color:#444;font-size:13px;margin:0 0 16px">
      A new booking has been submitted via the Book Us form. Full details below.
    </p>
    ${buildDetailsTable(b)}
    ${
      b.themeFileUrl || b.receiptFileUrl
        ? `<h3 style="font-size:14px;letter-spacing:1px;margin:20px 0 8px">FILE LINKS (also attached)</h3>
          <ul style="font-size:13px;color:#444;line-height:1.7">
            ${b.themeFileUrl ? `<li>Theme Reference: <a href="${escapeHtml(b.themeFileUrl)}">${escapeHtml(b.themeFileName || "theme")}</a></li>` : ""}
            ${b.receiptFileUrl ? `<li>Proof of Payment: <a href="${escapeHtml(b.receiptFileUrl)}">${escapeHtml(b.receiptFileName || "receipt")}</a></li>` : ""}
          </ul>`
        : ""
    }
  </div>
</body></html>`;

async function fetchAttachment(url: string, filename: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < buf.length; i += chunkSize) {
      binary += String.fromCharCode(...buf.subarray(i, i + chunkSize));
    }
    return { filename, content: btoa(binary) };
  } catch (e) {
    console.error("Attachment fetch failed:", url, e);
    return null;
  }
}

async function sendViaResend(payload: Record<string, unknown>) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend error [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const b = (await req.json()) as BookingPayload;
    if (!b?.bookingNumber || !b?.email || !b?.clientName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Client confirmation (BCC admin)
    const clientResult = await sendViaResend({
      from: FROM_ADDRESS,
      to: [b.email],
      bcc: [ADMIN_EMAIL],
      subject: "BOOKING CONFIRMED – Photonix Photo Booth",
      html: clientHtml(b),
    });

    // 2) Internal admin email with attachments
    const attachments: Array<{ filename: string; content: string }> = [];
    if (b.themeFileUrl && b.themeFileName) {
      const a = await fetchAttachment(b.themeFileUrl, b.themeFileName);
      if (a) attachments.push(a);
    }
    if (b.receiptFileUrl && b.receiptFileName) {
      const a = await fetchAttachment(b.receiptFileUrl, b.receiptFileName);
      if (a) attachments.push(a);
    }

    const adminSubject = `NEW BOOKING SUBMISSION – ${b.bookingNumber} – ${b.clientName}`;
    const adminPayload: Record<string, unknown> = {
      from: FROM_ADDRESS,
      to: [ADMIN_EMAIL],
      subject: adminSubject,
      html: adminHtml(b),
    };
    if (attachments.length) adminPayload.attachments = attachments;
    const adminResult = await sendViaResend(adminPayload);

    return new Response(
      JSON.stringify({ success: true, client: clientResult, admin: adminResult }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("send-booking-emails error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
