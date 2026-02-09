import { describe, expect, it } from "vitest";
import {
  calculateJourneyHeight,
  renderJourney,
} from "../../../../adapters/presentation/layers/journey.renderer";
import type { JourneyEntry } from "../../../../domain/value-objects/journey-entry";
import { createMockTheme } from "../../../mocks/theme";

const theme = createMockTheme();

const sampleEntries: ReadonlyArray<JourneyEntry> = [
  { year: 2020, icon: "\u{1F331}", title: "Started coding" },
  { year: 2022, icon: "\u{1F680}", title: "First open source", tags: ["GitHub", "Nix"] },
  { year: 2024, icon: "\u{1F916}", title: "AI Engineering", tags: ["LLMs", "Agents"] },
];

describe("renderJourney", () => {
  it("should return svg and height", () => {
    const result = renderJourney(sampleEntries, theme);

    expect(typeof result.svg).toBe("string");
    expect(typeof result.height).toBe("number");
    expect(result.height).toBeGreaterThan(0);
  });

  it("should render each entry year", () => {
    const result = renderJourney(sampleEntries, theme);

    expect(result.svg).toContain("2020");
    expect(result.svg).toContain("2022");
    expect(result.svg).toContain("2024");
  });

  it("should render each entry title", () => {
    const result = renderJourney(sampleEntries, theme);

    expect(result.svg).toContain("Started coding");
    expect(result.svg).toContain("First open source");
    expect(result.svg).toContain("AI Engineering");
  });

  it("should render tags as badges when present", () => {
    const result = renderJourney(sampleEntries, theme);

    expect(result.svg).toContain("GitHub");
    expect(result.svg).toContain("Nix");
    expect(result.svg).toContain("LLMs");
    expect(result.svg).toContain("Agents");
  });

  it("should handle entries without tags", () => {
    const entries: ReadonlyArray<JourneyEntry> = [
      { year: 2020, icon: "\u{1F331}", title: "Started coding" },
    ];
    const result = renderJourney(entries, theme);

    expect(result.svg).toContain("Started coding");
    expect(result.svg).toContain("2020");
  });

  it("should return empty group for empty array", () => {
    const result = renderJourney([], theme);

    expect(result.svg).toContain("journey");
    expect(result.height).toBe(0);
  });

  it("should apply y offset", () => {
    const result = renderJourney(sampleEntries, theme, 100);

    expect(result.svg).toContain('transform="translate(0, 100)"');
  });

  it("should be a pure function", () => {
    const result1 = renderJourney(sampleEntries, theme);
    const result2 = renderJourney(sampleEntries, theme);

    expect(result1.svg).toBe(result2.svg);
    expect(result1.height).toBe(result2.height);
  });

  it("should use theme colors", () => {
    const result = renderJourney(sampleEntries, theme);

    expect(result.svg).toContain(theme.colors.carpYellow);
    expect(result.svg).toContain(theme.colors.text);
  });
});

describe("calculateJourneyHeight", () => {
  it("should return 0 for empty entries", () => {
    expect(calculateJourneyHeight([])).toBe(0);
  });

  it("should increase with more entries", () => {
    const one = calculateJourneyHeight(sampleEntries.slice(0, 1));
    const three = calculateJourneyHeight(sampleEntries);

    expect(three).toBeGreaterThan(one);
  });

  it("should be a pure function", () => {
    expect(calculateJourneyHeight(sampleEntries)).toBe(calculateJourneyHeight(sampleEntries));
  });

  it("should match renderJourney height", () => {
    const calculated = calculateJourneyHeight(sampleEntries);
    const rendered = renderJourney(sampleEntries, theme);

    expect(calculated).toBe(rendered.height);
  });
});
