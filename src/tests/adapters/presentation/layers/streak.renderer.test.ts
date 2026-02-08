import { describe, expect, it } from "vitest";
import { renderStreak } from "../../../../adapters/presentation/layers/streak.renderer";
import type { StreakInfo } from "../../../../domain/value-objects/streak-info";
import { KanagawaTheme } from "../../../../theme/kanagawa";
import { svgAssertions } from "../../../__support__/helpers";

describe("Streak Renderer", () => {
  const streak: StreakInfo = {
    currentStreak: 15,
    longestStreak: 30,
    lastContributionDate: new Date(),
    isActive: true,
  };

  it("should render fire emoji", () => {
    const svg = renderStreak(streak, KanagawaTheme, 600, 80);
    svgAssertions.hasText(svg, "🔥");
    svgAssertions.hasClass(svg, "streak__fire");
  });

  it("should render streak count", () => {
    const svg = renderStreak(streak, KanagawaTheme, 600, 80);
    svgAssertions.hasText(svg, "15 day streak");
    svgAssertions.hasClass(svg, "streak__count");
  });

  it("should apply positioning", () => {
    const svg = renderStreak(streak, KanagawaTheme, 600, 80);
    svgAssertions.hasTransform(svg, 600, 80);
  });

  it("should be empty if no streak", () => {
    const emptyStreak = { ...streak, currentStreak: 0 };
    const svg = renderStreak(emptyStreak, KanagawaTheme, 600, 80);
    expect(svg).toContain("<g></g>");
  });
});
