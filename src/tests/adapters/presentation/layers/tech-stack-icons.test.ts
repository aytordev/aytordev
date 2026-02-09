import { describe, expect, it } from "vitest";
import { getTechIcon, TECH_ICONS } from "../../../../adapters/presentation/layers/tech-stack-icons";

describe("Tech Stack Icons", () => {
  describe("getTechIcon", () => {
    it("should return icon for known technology", () => {
      const icon = getTechIcon("TypeScript");
      expect(icon).toEqual({ abbr: "TS", color: "#3178C6" });
    });

    it("should be case-insensitive", () => {
      const lower = getTechIcon("typescript");
      const upper = getTechIcon("TYPESCRIPT");
      const mixed = getTechIcon("TypeScript");

      expect(lower).toEqual(mixed);
      expect(upper).toEqual(mixed);
    });

    it("should return null for unknown technology", () => {
      expect(getTechIcon("unknown-tech-xyz")).toBeNull();
    });

    it("should be a pure function (same input produces same output)", () => {
      const result1 = getTechIcon("Rust");
      const result2 = getTechIcon("Rust");
      expect(result1).toEqual(result2);
    });
  });

  describe("TECH_ICONS registry", () => {
    it("should have abbreviations of 1-2 characters", () => {
      Object.values(TECH_ICONS).forEach((icon) => {
        expect(icon.abbr.length).toBeGreaterThanOrEqual(1);
        expect(icon.abbr.length).toBeLessThanOrEqual(2);
      });
    });

    it("should have valid hex color strings", () => {
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;
      Object.values(TECH_ICONS).forEach((icon) => {
        expect(icon.color).toMatch(hexPattern);
      });
    });
  });
});
