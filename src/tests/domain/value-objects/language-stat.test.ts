import { describe, expect, it } from "vitest";
import { createLanguageStat } from "../../../domain/value-objects/language-stat";

describe("createLanguageStat", () => {
  it("should create valid LanguageStat", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: 85.5,
      bytes: 10240,
      color: "#3178C6",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("TypeScript");
      expect(result.value.percentage).toBe(85.5);
      expect(result.value.bytes).toBe(10240);
      expect(result.value.color).toBe("#3178C6");
    }
  });

  it("should normalize color to uppercase", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: 85.5,
      bytes: 10240,
      color: "#3178c6",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.color).toBe("#3178C6");
    }
  });

  it("should reject empty name", () => {
    const result = createLanguageStat({
      name: "",
      percentage: 85.5,
      bytes: 10240,
      color: "#3178C6",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("name cannot be empty");
    }
  });

  it("should reject percentage below 0", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: -1,
      bytes: 10240,
      color: "#3178C6",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("between 0 and 100");
    }
  });

  it("should reject percentage above 100", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: 150,
      bytes: 10240,
      color: "#3178C6",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("between 0 and 100");
    }
  });

  it("should accept percentage at boundaries", () => {
    const result0 = createLanguageStat({
      name: "TypeScript",
      percentage: 0,
      bytes: 10240,
      color: "#3178C6",
    });
    expect(result0.ok).toBe(true);

    const result100 = createLanguageStat({
      name: "TypeScript",
      percentage: 100,
      bytes: 10240,
      color: "#3178C6",
    });
    expect(result100.ok).toBe(true);
  });

  it("should reject negative bytes", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: 85.5,
      bytes: -100,
      color: "#3178C6",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("cannot be negative");
    }
  });

  it("should accept zero bytes", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: 0,
      bytes: 0,
      color: "#3178C6",
    });

    expect(result.ok).toBe(true);
  });

  it("should reject invalid color format", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: 85.5,
      bytes: 10240,
      color: "blue",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("hex format");
    }
  });

  it("should reject short hex color", () => {
    const result = createLanguageStat({
      name: "TypeScript",
      percentage: 85.5,
      bytes: 10240,
      color: "#FFF",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("hex format");
    }
  });
});
