import { describe, expect, it } from "vitest";
import { cityHallClassicLinks, cityHallHighAngleLinks } from "../pages/PopUp";

describe("City Hall Grounds pop-up photo links", () => {
  it("opens the Classic November 22, 2026 album", () => {
    expect(cityHallClassicLinks["2026-11-22"]).toBe("https://fotoshare.co/e/M0QrDYdf2EDrUNPynr0wP");
  });

  it("opens the High-Angle November 22, 2026 album", () => {
    expect(cityHallHighAngleLinks["2026-11-22"]).toBe("https://fotoshare.co/e/CEaUN2u9RneNA-3lChDXd");
  });
});