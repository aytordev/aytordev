import { describe, expect, it } from "vitest";
import { getTechIcon, TECH_ICONS } from "../../../../adapters/presentation/layers/tech-stack-icons";

describe("Tech Stack Icons", () => {
  describe("getTechIcon", () => {
    it("should return icon with SVG path for known technology", () => {
      const icon = getTechIcon("TypeScript");
      expect(icon).not.toBeNull();
      expect(icon!.path).toBeDefined();
      expect(icon!.color).toBe("#3178C6");
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
    it("should have non-empty SVG path strings", () => {
      Object.values(TECH_ICONS).forEach((icon) => {
        expect(icon.path.length).toBeGreaterThan(0);
        expect(icon.path).toContain("M");
      });
    });

    it("should have valid hex color strings", () => {
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;
      Object.values(TECH_ICONS).forEach((icon) => {
        expect(icon.color).toMatch(hexPattern);
      });
    });

    it("should have total path data within SVG budget", () => {
      const totalBytes = Object.values(TECH_ICONS).reduce((sum, icon) => sum + icon.path.length, 0);
      // Total path data should stay under 25KB to leave room in 80KB SVG budget
      expect(totalBytes).toBeLessThan(25000);
    });
  });
});
