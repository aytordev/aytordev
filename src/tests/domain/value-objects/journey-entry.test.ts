import { describe, expect, it } from "vitest";
import { createJourneyEntry } from "../../../domain/value-objects/journey-entry";

describe("createJourneyEntry", () => {
  it("should create valid JourneyEntry without tags", () => {
    const result = createJourneyEntry({
      year: 2020,
      icon: "🌱",
      title: "Started coding",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.year).toBe(2020);
      expect(result.value.icon).toBe("🌱");
      expect(result.value.title).toBe("Started coding");
      expect(result.value.tags).toBeUndefined();
    }
  });

  it("should create valid JourneyEntry with tags", () => {
    const result = createJourneyEntry({
      year: 2024,
      icon: "🤖",
      title: "AI Engineering",
      tags: ["LLMs", "Agents"],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.year).toBe(2024);
      expect(result.value.icon).toBe("🤖");
      expect(result.value.title).toBe("AI Engineering");
      expect(result.value.tags).toEqual(["LLMs", "Agents"]);
    }
  });

  it("should trim whitespace from title", () => {
    const result = createJourneyEntry({
      year: 2020,
      icon: "🌱",
      title: "  Started coding  ",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.title).toBe("Started coding");
    }
  });

  it("should trim whitespace from tags", () => {
    const result = createJourneyEntry({
      year: 2024,
      icon: "🤖",
      title: "AI",
      tags: ["  LLMs  ", "  Agents  "],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.tags).toEqual(["LLMs", "Agents"]);
    }
  });

  it("should reject year below 1900", () => {
    const result = createJourneyEntry({
      year: 1899,
      icon: "📅",
      title: "Too old",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("between 1900");
    }
  });

  it("should reject year above 2100", () => {
    const result = createJourneyEntry({
      year: 2101,
      icon: "📅",
      title: "Too far",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("between 1900");
    }
  });

  it("should accept boundary years", () => {
    const r1 = createJourneyEntry({ year: 1900, icon: "📅", title: "Start" });
    const r2 = createJourneyEntry({ year: 2100, icon: "📅", title: "End" });

    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
  });

  it("should reject empty icon", () => {
    const result = createJourneyEntry({
      year: 2020,
      icon: "",
      title: "No icon",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("icon cannot be empty");
    }
  });

  it("should reject empty title", () => {
    const result = createJourneyEntry({
      year: 2020,
      icon: "🌱",
      title: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("title cannot be empty");
    }
  });

  it("should reject more than 5 tags", () => {
    const result = createJourneyEntry({
      year: 2020,
      icon: "🌱",
      title: "Test",
      tags: ["a", "b", "c", "d", "e", "f"],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("5 tags");
    }
  });

  it("should accept exactly 5 tags", () => {
    const result = createJourneyEntry({
      year: 2020,
      icon: "🌱",
      title: "Test",
      tags: ["a", "b", "c", "d", "e"],
    });

    expect(result.ok).toBe(true);
  });

  it("should produce immutable value object", () => {
    const result = createJourneyEntry({
      year: 2020,
      icon: "🌱",
      title: "Started coding",
      tags: ["TypeScript"],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.year).toBe(2020);
      expect(result.value.tags).toEqual(["TypeScript"]);
    }
  });
});
