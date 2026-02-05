import { describe, expect, it } from "vitest";
import type { StreakInfo } from "../../../domain/value-objects/streak-info";
import { renderStreak } from "../../../rendering/layers/streak.renderer";
import { KanagawaTheme } from "../../../theme/kanagawa";

describe("Streak Renderer", () => {
  const streak: StreakInfo = {
    currentStreak: 15,
    longestStreak: 30,
    lastContributionDate: new Date(),
    isActive: true,
  };

  it("should render fire emoji", () => {
    const svg = renderStreak(streak, KanagawaTheme, 600, 80);
    expect(svg).toContain("🔥");
    expect(svg).toContain('class="streak__fire"');
  });

  it("should render streak count", () => {
    const svg = renderStreak(streak, KanagawaTheme, 600, 80);
    expect(svg).toContain("15 day streak");
    expect(svg).toContain('class="streak__count"');
  });

  it("should apply positioning", () => {
    const svg = renderStreak(streak, KanagawaTheme, 600, 80);
    expect(svg).toContain('transform="translate(600, 80)"');
  });

  it("should be empty if no streak", () => {
    const emptyStreak = { ...streak, currentStreak: 0 };
    const svg = renderStreak(emptyStreak, KanagawaTheme, 600, 80);
    expect(svg).toContain("<g></g>");
  });
});
