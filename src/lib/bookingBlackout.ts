// Private-event booking blackout window (inclusive, Asia/Manila).
// PHOTONIX pauses private event bookings in this period to focus on pop-up events.
// Kept in sync with the same range in supabase/functions/calendar-availability.
export const BLACKOUT_START = "2026-10-15";
export const BLACKOUT_END = "2027-01-15";

export const BLACKOUT_NOTICE_LABEL = "Booking Notice:";
export const BLACKOUT_NOTICE_BODY =
  "PHOTONIX will not be accepting private event bookings from October 15, 2026, to January 15, 2027, as we focus on our upcoming pop-up events. Hope to see you around!";
export const BLACKOUT_NOTICE = `${BLACKOUT_NOTICE_LABEL} ${BLACKOUT_NOTICE_BODY}`;

// YYYY-MM-DD in Asia/Manila for a Date
const toManilaYMD = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

export const isBlackoutDate = (input: Date | string): boolean => {
  const key = typeof input === "string" ? input.slice(0, 10) : toManilaYMD(input);
  return key >= BLACKOUT_START && key <= BLACKOUT_END;
};
