import { describe, it, expect } from "vitest";
import { isBlackoutDate } from "../lib/bookingBlackout";

describe("private-event booking blackout window (Oct 15, 2026 - Jan 15, 2027)", () => {
  it("blocks both endpoints of the window", () => {
    expect(isBlackoutDate("2026-10-15")).toBe(true);
    expect(isBlackoutDate("2027-01-15")).toBe(true);
  });

  it("blocks dates inside the window", () => {
    expect(isBlackoutDate("2026-11-02")).toBe(true);
    expect(isBlackoutDate("2026-12-25")).toBe(true);
    expect(isBlackoutDate("2027-01-01")).toBe(true);
  });

  it("allows the day before and the day after the window", () => {
    expect(isBlackoutDate("2026-10-14")).toBe(false);
    expect(isBlackoutDate("2027-01-16")).toBe(false);
  });

  it("treats a midnight Manila Date as the same calendar day", () => {
    expect(isBlackoutDate(new Date("2026-10-15T00:00:00+08:00"))).toBe(true);
    expect(isBlackoutDate(new Date("2027-01-15T23:30:00+08:00"))).toBe(true);
    expect(isBlackoutDate(new Date("2027-01-16T00:30:00+08:00"))).toBe(false);
  });
});
