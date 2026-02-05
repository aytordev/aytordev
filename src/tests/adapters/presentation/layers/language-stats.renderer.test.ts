import { describe, expect, it } from "vitest";
import type { LanguageStat } from "../../../../domain/value-objects/language-stat";
import { renderLanguageStats } from "../../../../adapters/presentation/layers/language-stats.renderer";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Language Stats Renderer", () => {
  const stats: LanguageStat[] = [
    { name: "TypeScript", percentage: 48, bytes: 1200000, color: "#3178C6" },
    { name: "Rust", percentage: 25, bytes: 625000, color: "#DEA584" },
    { name: "Nix", percentage: 15, bytes: 375000, color: "#7E7EFF" },
  ];

  it("should return empty string when no stats", () => {
    const svg = renderLanguageStats([], KanagawaTheme);
    expect(svg).toBe("");
  });

  it("should render language names", () => {
    const svg = renderLanguageStats(stats, KanagawaTheme);
    expect(svg).toContain("TypeScript");
    expect(svg).toContain("Rust");
    expect(svg).toContain("Nix");
  });

  it("should render percentages", () => {
    const svg = renderLanguageStats(stats, KanagawaTheme);
    expect(svg).toContain("48%");
    expect(svg).toContain("25%");
    expect(svg).toContain("15%");
  });

  it("should create gradient definitions", () => {
    const svg = renderLanguageStats(stats, KanagawaTheme);
    expect(svg).toContain("linearGradient");
    expect(svg).toContain('id="lang-grad-0"');
    expect(svg).toContain('id="lang-grad-1"');
  });

  it("should render bar rectangles with gradient fill", () => {
    const svg = renderLanguageStats(stats, KanagawaTheme);
    expect(svg).toContain('fill="url(#lang-grad-0)"');
    expect(svg).toContain('rx="2"');
  });

  it("should render header text", () => {
    const svg = renderLanguageStats(stats, KanagawaTheme);
    expect(svg).toContain("Code distribution (public repos):");
  });
});
