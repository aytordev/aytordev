import { describe, expect, it } from "vitest";
import { getEasterEgg } from "../../../domain/services/easter-egg.service";

describe("Easter Egg Service", () => {
  it("returns null for normal day", () => {
    const date = new Date("2024-02-01"); // Random normal day
    expect(getEasterEgg(date)).toBeNull();
  });

  it("detects May the 4th", () => {
    const date = new Date("2024-05-04");
    expect(getEasterEgg(date)).toBe("may-the-4th");
  });

  it("detects Halloween", () => {
    const date = new Date("2024-10-31");
    expect(getEasterEgg(date)).toBe("halloween");
  });

  it("detects Christmas", () => {
    const date = new Date("2024-12-25");
    expect(getEasterEgg(date)).toBe("christmas");
  });

  it("detects Friday the 13th", () => {
    const date = new Date("2024-09-13"); // Sept 13 2024 is Friday
    expect(getEasterEgg(date)).toBe("friday-13th");
  });
});
