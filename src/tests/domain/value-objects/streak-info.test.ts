import { describe, expect, it } from "vitest";
import { createStreakInfo } from "../../../domain/value-objects/streak-info";

describe("createStreakInfo", () => {
  it("should create valid StreakInfo", () => {
    const date = new Date("2024-01-15");
    const result = createStreakInfo({
      currentStreak: 5,
      longestStreak: 10,
      lastContributionDate: date,
      isActive: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.currentStreak).toBe(5);
      expect(result.value.longestStreak).toBe(10);
      expect(result.value.lastContributionDate).toBe(date);
      expect(result.value.isActive).toBe(true);
    }
  });

  it("should accept when currentStreak equals longestStreak", () => {
    const result = createStreakInfo({
      currentStreak: 10,
      longestStreak: 10,
      lastContributionDate: new Date(),
      isActive: true,
    });

    expect(result.ok).toBe(true);
  });

  it("should reject negative currentStreak", () => {
    const result = createStreakInfo({
      currentStreak: -1,
      longestStreak: 10,
      lastContributionDate: new Date(),
      isActive: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("cannot be negative");
    }
  });

  it("should reject negative longestStreak", () => {
    const result = createStreakInfo({
      currentStreak: 5,
      longestStreak: -1,
      lastContributionDate: new Date(),
      isActive: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("cannot be negative");
    }
  });

  it("should reject longestStreak < currentStreak", () => {
    const result = createStreakInfo({
      currentStreak: 10,
      longestStreak: 5,
      lastContributionDate: new Date(),
      isActive: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("greater than or equal to current streak");
    }
  });

  it("should reject invalid date", () => {
    const result = createStreakInfo({
      currentStreak: 5,
      longestStreak: 10,
      lastContributionDate: new Date("invalid"),
      isActive: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("invalid");
    }
  });

  it("should accept zero streaks", () => {
    const result = createStreakInfo({
      currentStreak: 0,
      longestStreak: 0,
      lastContributionDate: new Date(),
      isActive: false,
    });

    expect(result.ok).toBe(true);
  });
});
