// Fetches Google Calendar events for a date range and computes:
// - Blocked dates (all-day BLOCKED/UNAVAILABLE/FULLY BOOKED events, or >=2 bookings)
// - Booth-specific availability per date (Basic/Curtain/Classic = 1/day, High-Angle = 2/day)
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const CALENDAR_ID = Deno.env.get("PHOTONIX_CALENDAR_ID") || "primary";
const TZ = "Asia/Manila";

const BLOCK_KEYWORDS = ["BLOCKED", "UNAVAILABLE", "FULLY BOOKED"];
const MAX_BOOKINGS_PER_DAY = 2;
const BOOTH_LIMITS: Record<string, number> = {
  Basic: 1,
  Curtain: 1,
  Classic: 1,
  "High-Angle": 2,
};

interface GCalEvent {
  summary?: string;
  status?: string;
  transparency?: string;
  start?: { date?: string; dateTime?: string; timeZone?: string };
  end?: { date?: string; dateTime?: string; timeZone?: string };
}

// Returns YYYY-MM-DD in Asia/Manila for a given Date or ISO string.
function toManilaDateStr(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d); // en-CA -> YYYY-MM-DD
}

function isBlockingTitle(summary?: string): boolean {
  if (!summary) return false;
  const u = summary.toUpperCase();
  return BLOCK_KEYWORDS.some((k) => u.includes(k));
}

// Try to extract booth type from event title (created with `[BOOKED] - {Booth} - {Client}`).
function extractBooth(summary?: string): string | null {
  if (!summary) return null;
  const m = summary.match(/\[BOOKED\]\s*-\s*([^-]+?)\s*-/i);
  if (!m) return null;
  const raw = m[1].trim().replace(/\s+booth$/i, "").trim();
  // Normalize known names
  const lower = raw.toLowerCase();
  if (lower === "basic") return "Basic";
  if (lower === "curtain") return "Curtain";
  if (lower === "classic") return "Classic";
  if (lower === "high-angle" || lower === "high angle") return "High-Angle";
  return null;
}

async function fetchEvents(timeMinISO: string, timeMaxISO: string): Promise<GCalEvent[]> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
  if (!GOOGLE_CALENDAR_API_KEY) throw new Error("GOOGLE_CALENDAR_API_KEY not configured");

  const url = new URL(`${GATEWAY_URL}/calendars/${encodeURIComponent(CALENDAR_ID)}/events`);
  url.searchParams.set("timeMin", timeMinISO);
  url.searchParams.set("timeMax", timeMaxISO);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "2500");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Google Calendar list events failed [${res.status}]: ${JSON.stringify(data)}`);
  }
  return (data.items || []) as GCalEvent[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    // Defaults: today through +180 days
    const now = new Date();
    const defaultStart = new Date(now); defaultStart.setHours(0, 0, 0, 0);
    const defaultEnd = new Date(now); defaultEnd.setDate(defaultEnd.getDate() + 180);

    const startParam = url.searchParams.get("start");
    const endParam = url.searchParams.get("end");
    const timeMin = startParam ? new Date(startParam) : defaultStart;
    const timeMax = endParam ? new Date(endParam) : defaultEnd;

    const events = await fetchEvents(timeMin.toISOString(), timeMax.toISOString());

    // Per-date aggregation
    type DateInfo = {
      blocked: boolean;
      reason?: string;
      bookingsCount: number;
      boothCounts: Record<string, number>;
    };
    const byDate: Record<string, DateInfo> = {};

    const ensure = (d: string): DateInfo => {
      if (!byDate[d]) {
        byDate[d] = { blocked: false, bookingsCount: 0, boothCounts: {} };
      }
      return byDate[d];
    };

    for (const ev of events) {
      if (ev.status === "cancelled") continue;
      const isAllDay = !!ev.start?.date && !ev.end?.date && false; // computed below
      const startStr = ev.start?.date || ev.start?.dateTime;
      const endStr = ev.end?.date || ev.end?.dateTime;
      if (!startStr) continue;

      // Build the set of dates this event touches (inclusive of start, exclusive of end for all-day)
      const dates: string[] = [];
      if (ev.start?.date && ev.end?.date) {
        // All-day, possibly multi-day. end.date is exclusive per Google spec.
        const s = new Date(`${ev.start.date}T00:00:00`);
        const e = new Date(`${ev.end.date}T00:00:00`);
        for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
          dates.push(toManilaDateStr(new Date(`${d.toISOString().slice(0, 10)}T00:00:00+08:00`)));
        }
        if (dates.length === 0) dates.push(ev.start.date);
      } else {
        // Timed event — use start date in Manila TZ
        dates.push(toManilaDateStr(startStr!));
      }

      const blocking = isBlockingTitle(ev.summary);
      const allDayBlocking = blocking && !!ev.start?.date;
      const booth = extractBooth(ev.summary);

      for (const d of dates) {
        const info = ensure(d);
        if (allDayBlocking || blocking) {
          info.blocked = true;
          info.reason = "BLOCKED";
        }
        // Count anything that is not purely an availability annotation as a booking
        if (!blocking) {
          info.bookingsCount += 1;
          if (booth) {
            info.boothCounts[booth] = (info.boothCounts[booth] || 0) + 1;
          }
        }
      }
    }

    // Apply max-bookings-per-day rule
    for (const d of Object.keys(byDate)) {
      const info = byDate[d];
      if (!info.blocked && info.bookingsCount >= MAX_BOOKINGS_PER_DAY) {
        info.blocked = true;
        info.reason = "FULLY_BOOKED";
      }
    }

    // Build response
    const blockedDates: { date: string; reason: string }[] = [];
    const boothAvailability: Record<string, Record<string, boolean>> = {};
    for (const [d, info] of Object.entries(byDate)) {
      if (info.blocked) {
        blockedDates.push({ date: d, reason: info.reason || "BLOCKED" });
      }
      const avail: Record<string, boolean> = {};
      for (const [booth, limit] of Object.entries(BOOTH_LIMITS)) {
        const used = info.boothCounts[booth] || 0;
        avail[booth] = used < limit && !info.blocked;
      }
      boothAvailability[d] = avail;
    }

    return new Response(
      JSON.stringify({
        success: true,
        timezone: TZ,
        range: { start: timeMin.toISOString(), end: timeMax.toISOString() },
        boothLimits: BOOTH_LIMITS,
        maxBookingsPerDay: MAX_BOOKINGS_PER_DAY,
        blockedDates,
        boothAvailability,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("calendar-availability error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
