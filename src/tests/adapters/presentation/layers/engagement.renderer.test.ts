import { describe, expect, it } from "vitest";
import { renderEngagement } from "../../../../adapters/presentation/layers/engagement.renderer";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Engagement Renderer", () => {
  it("should render nothing if disabled or empty", () => {
    const svg = renderEngagement({}, KanagawaTheme);
    expect(svg).toBe("<g></g>");
  });

  it("should render learning journey", () => {
    const svg = renderEngagement(
      { learningJourney: { current: "Rust" } },
      KanagawaTheme,
    );
    expect(svg).toContain("Learning Journey");
    expect(svg).toContain("Rust");
  });

  it("should render daily quote", () => {
    const svg = renderEngagement({ dailyQuote: "Hello world" }, KanagawaTheme);
    expect(svg).toContain("Daily Quote");
    expect(svg).toContain("Hello world");
  });

  it("should render today's focus", () => {
    const svg = renderEngagement(
      { todayFocus: "Shipping to prod" },
      KanagawaTheme,
    );
    expect(svg).toContain("Today's Focus");
    expect(svg).toContain("Shipping to prod");
  });
});
