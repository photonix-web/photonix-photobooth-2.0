import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM_ADDRESS =
  Deno.env.get("INQUIRY_EMAIL_FROM") ||
  "Photonix Photo Booth <inquiry@photonixphotobooth.com>";
const ADMIN_EMAIL = "photonix.biz@gmail.com";

interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const escapeHtml = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const clientHtml = (p: InquiryPayload) => `
<!doctype html><html><body style="font-family:Arial,sans-serif;background:#ffffff;color:#111;margin:0;padding:24px">
  <div style="max-width:600px;margin:0 auto">
    <h1 style="color:#111;font-size:22px;letter-spacing:2px;margin:0 0 16px">THANK YOU FOR YOUR EMAIL</h1>
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 14px">
      Hi ${escapeHtml(p.name)},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 14px">
      Thank you for reaching out to <strong>Photonix Photo Booth</strong>! We have received your inquiry and will respond to your queries as soon as possible.
    </p>
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 14px">
      For faster replies, you may also message our Facebook Page <strong>@photonixbooth</strong>.
    </p>
    <p style="color:#888;font-size:12px;margin-top:24px">— Photonix Photo Booth Team</p>
  </div>
</body></html>`;

const adminHtml = (p: InquiryPayload) => `
<!doctype html><html><body style="font-family:Arial,sans-serif;background:#ffffff;color:#111;margin:0;padding:24px">
  <div style="max-width:640px;margin:0 auto">
    <h1 style="color:#111;font-size:20px;letter-spacing:2px;margin:0 0 12px">NEW CONTACT INQUIRY</h1>
    <table style="width:100%;border-collapse:collapse;background:#fafafa;border:1px solid #eee;border-radius:8px;overflow:hidden">
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;width:30%">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-size:13px">${escapeHtml(p.name)}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-size:13px">${escapeHtml(p.email)}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-size:13px">${escapeHtml(p.phone || "—")}</td></tr>
      <tr><td style="padding:8px 12px;color:#666;font-size:13px;vertical-align:top">Message</td><td style="padding:8px 12px;color:#111;font-size:13px;white-space:pre-wrap">${escapeHtml(p.message)}</td></tr>
    </table>
  </div>
</body></html>`;

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
    const p = (await req.json()) as InquiryPayload;
    if (!p?.name || !p?.email || !p?.message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auto-reply to client (BCC admin)
    const clientResult = await sendViaResend({
      from: FROM_ADDRESS,
      to: [p.email],
      bcc: [ADMIN_EMAIL],
      reply_to: ADMIN_EMAIL,
      subject: "Thank you for your email – Photonix Photo Booth",
      html: clientHtml(p),
    });

    // Internal notification to admin with full inquiry details
    const adminResult = await sendViaResend({
      from: FROM_ADDRESS,
      to: [ADMIN_EMAIL],
      reply_to: p.email,
      subject: `NEW CONTACT INQUIRY – ${p.name}`,
      html: adminHtml(p),
    });

    return new Response(
      JSON.stringify({ success: true, client: clientResult, admin: adminResult }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("send-contact-inquiry error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
