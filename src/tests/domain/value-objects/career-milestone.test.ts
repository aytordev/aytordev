import { describe, expect, it } from "vitest";
import { createCareerMilestone } from "../../../domain/value-objects/career-milestone";

describe("createCareerMilestone", () => {
  it("should create valid CareerMilestone with company", () => {
    const result = createCareerMilestone({
      year: 2024,
      title: "Senior Engineer",
      company: "Tech Corp",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.year).toBe(2024);
      expect(result.value.title).toBe("Senior Engineer");
      expect(result.value.company).toBe("Tech Corp");
    }
  });

  it("should create valid CareerMilestone without company", () => {
    const result = createCareerMilestone({
      year: 2024,
      title: "Senior Engineer",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.year).toBe(2024);
      expect(result.value.title).toBe("Senior Engineer");
      expect(result.value.company).toBeUndefined();
    }
  });

  it("should trim whitespace from fields", () => {
    const result = createCareerMilestone({
      year: 2024,
      title: "  Senior Engineer  ",
      company: "  Tech Corp  ",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.title).toBe("Senior Engineer");
      expect(result.value.company).toBe("Tech Corp");
    }
  });

  it("should reject year below 1900", () => {
    const result = createCareerMilestone({
      year: 1800,
      title: "Senior Engineer",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("between 1900");
    }
  });

  it("should reject year too far in future", () => {
    const currentYear = new Date().getFullYear();
    const result = createCareerMilestone({
      year: currentYear + 20,
      title: "Senior Engineer",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("between 1900");
    }
  });

  it("should accept current year", () => {
    const currentYear = new Date().getFullYear();
    const result = createCareerMilestone({
      year: currentYear,
      title: "Senior Engineer",
    });

    expect(result.ok).toBe(true);
  });

  it("should accept year 1900", () => {
    const result = createCareerMilestone({
      year: 1900,
      title: "Senior Engineer",
    });

    expect(result.ok).toBe(true);
  });

  it("should reject empty title", () => {
    const result = createCareerMilestone({
      year: 2024,
      title: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("cannot be empty");
    }
  });

  it("should reject empty company string", () => {
    const result = createCareerMilestone({
      year: 2024,
      title: "Senior Engineer",
      company: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("cannot be an empty string");
    }
  });
});
