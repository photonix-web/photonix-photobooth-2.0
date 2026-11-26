import { describe, expect, it } from "vitest";
import { cityHallClassicLinks, cityHallHighAngleLinks } from "../pages/PopUp";

describe("City Hall Grounds pop-up photo links", () => {
  it("opens the Classic November 22, 2026 album", () => {
    expect(cityHallClassicLinks["2026-11-22"]).toBe("https://fotoshare.co/e/M0QrDYdf2EDrUNPynr0wP");
  });

  it("opens the High-Angle November 22, 2026 album", () => {
    expect(cityHallHighAngleLinks["2026-11-22"]).toBe("https://fotoshare.co/e/CEaUN2u9RneNA-3lChDXd");
  });

  it("opens the Classic November 23 and 24, 2026 albums", () => {
    expect(cityHallClassicLinks["2026-11-23"]).toBe("https://fotoshare.co/e/NccXdPV28v4Q7motOJ-ba");
    expect(cityHallClassicLinks["2026-11-24"]).toBe("https://fotoshare.co/e/xc5n2EJCvSaJnVrVLg5o-");
  });

  it("opens the High-Angle November 23 and 24, 2026 albums", () => {
    expect(cityHallHighAngleLinks["2026-11-23"]).toBe("https://fotoshare.co/e/CEaUN2u9RneNA-3lChDXd");
    expect(cityHallHighAngleLinks["2026-11-24"]).toBe("https://fotoshare.co/e/_zD5qjCMQ3p4B5i3YNwkD");
  });

  it("opens the November 25 albums", () => {
    expect(cityHallClassicLinks["2026-11-25"]).toBe("https://fotoshare.co/e/-Y5KvzIBHnS7vuFeqQoy1");
    expect(cityHallHighAngleLinks["2026-11-25"]).toBe("https://fotoshare.co/e/jprDGW8yd2EfCfUzmyGzG");
  });
});