// Creates a Google Calendar event for a confirmed booking.
// Title format: `[BOOKED] - {Booth Type} - {Client Name}`
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const CALENDAR_ID = Deno.env.get("PHOTONIX_CALENDAR_ID") || "primary";
const TZ = "Asia/Manila";

interface CreateEventPayload {
  bookingNumber: string;
  clientName: string;
  email: string;
  phone: string;
  booth: string;          // Basic | Curtain | Classic | High-Angle
  packageType: string;
  eventName: string;
  eventDate: string;      // YYYY-MM-DD (Manila local)
  startTime: string;      // HH:mm (24h, Manila local)
  durationHours?: number; // default 4
  fullAddress: string;
  paxGuest?: string;
  themeMotif?: string;
  backdropColor?: string;
  totalPrice?: string;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

function buildLocalISO(dateYMD: string, time: string, addHours: number): string {
  // Construct a wall-clock ISO string with no Z; combined with timeZone field below.
  const [y, m, d] = dateYMD.split("-").map(Number);
  const [hh, mm] = (time || "12:00").split(":").map(Number);
  const start = new Date(Date.UTC(y, (m - 1), d, hh, mm, 0));
  const end = new Date(start.getTime() + addHours * 3600 * 1000);
  const fmt = (dt: Date) =>
    `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:00`;
  return JSON.stringify({ start: fmt(start), end: fmt(end) });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!GOOGLE_CALENDAR_API_KEY) throw new Error("GOOGLE_CALENDAR_API_KEY not configured");

    const b = (await req.json()) as CreateEventPayload;
    if (!b?.bookingNumber || !b?.clientName || !b?.booth || !b?.eventDate || !b?.startTime) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const duration = b.durationHours ?? 4;
    const { start, end } = JSON.parse(buildLocalISO(b.eventDate, b.startTime, duration));

    const summary = `[BOOKED] - ${b.booth} Booth - ${b.clientName}`;
    const description = [
      `Booking Number: ${b.bookingNumber}`,
      `Event: ${b.eventName}`,
      `Package: ${b.booth} — ${b.packageType}`,
      b.backdropColor ? `Backdrop: ${b.backdropColor}` : "",
      b.themeMotif ? `Theme/Motif: ${b.themeMotif}` : "",
      b.paxGuest ? `Pax/Guest: ${b.paxGuest}` : "",
      ``,
      `Client: ${b.clientName}`,
      `Email: ${b.email}`,
      `Phone: ${b.phone}`,
      ``,
      `Location: ${b.fullAddress}`,
      b.totalPrice ? `Total: ${b.totalPrice}` : "",
    ].filter(Boolean).join("\n");

    const eventBody = {
      summary,
      description,
      location: b.fullAddress,
      start: { dateTime: start, timeZone: TZ },
      end: { dateTime: end, timeZone: TZ },
      colorId: "9", // Blueberry (blue) per spec: blue = booked
      transparency: "opaque",
    };

    const url = `${GATEWAY_URL}/calendars/${encodeURIComponent(CALENDAR_ID)}/events`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventBody),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Google Calendar create event failed [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({ success: true, eventId: data.id, htmlLink: data.htmlLink }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("calendar-create-event error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
