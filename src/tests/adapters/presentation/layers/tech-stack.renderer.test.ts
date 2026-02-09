import { describe, expect, it } from "vitest";
import {
  calculateTechStackHeight,
  renderTechStack,
} from "../../../../adapters/presentation/layers/tech-stack.renderer";
import type { TechStack } from "../../../../domain/value-objects/tech-stack";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Tech Stack Renderer", () => {
  const techStack: TechStack = {
    categories: [
      {
        name: "Languages",
        items: ["TypeScript", "Rust", "Go"],
      },
      {
        name: "Tools",
        items: ["Docker", "Nix"],
      },
    ],
  };

  it("should render sections with titles", () => {
    const svg = renderTechStack(techStack, KanagawaTheme);
    expect(svg).toContain("Languages");
    expect(svg).toContain("Tools");
    expect(svg).toContain('class="stack__title"');
  });

  it("should render items", () => {
    const svg = renderTechStack(techStack, KanagawaTheme);
    expect(svg).toContain("TypeScript");
    expect(svg).toContain("Rust");
    expect(svg).toContain("Nix");
    expect(svg).toContain('class="stack__item"');
  });

  it("should handle empty stack", () => {
    const emptyStack: TechStack = { categories: [] };
    const svg = renderTechStack(emptyStack, KanagawaTheme);
    expect(svg).not.toContain('class="stack__title"');
  });

  it("should use dynamic coordinates", () => {
    const svg = renderTechStack(techStack, KanagawaTheme, 100, 200);
    expect(svg).toContain('transform="translate(100, 200)"');
  });
});

describe("calculateTechStackHeight", () => {
  it("should return 0 for empty categories", () => {
    expect(calculateTechStackHeight([])).toBe(0);
  });

  it("should calculate height for a single category", () => {
    const categories = [{ name: "Languages", items: ["TypeScript", "Rust", "Go"] }];
    // PADDING(20) + TITLE_HEIGHT(24) + 3 * ITEM_HEIGHT(20) = 104
    expect(calculateTechStackHeight(categories)).toBe(104);
  });

  it("should use tallest column for multiple categories", () => {
    const categories = [
      { name: "Languages", items: ["TypeScript", "Rust", "Go"] },
      { name: "Tools", items: ["Docker"] },
    ];
    // Height determined by max items (3): 20 + 24 + 3*20 = 104
    expect(calculateTechStackHeight(categories)).toBe(104);
  });

  it("should be a pure function (same input produces same output)", () => {
    const categories = [{ name: "Languages", items: ["TypeScript"] }];
    const result1 = calculateTechStackHeight(categories);
    const result2 = calculateTechStackHeight(categories);
    expect(result1).toBe(result2);
  });

  it("should not mutate input", () => {
    const categories = [
      { name: "Languages", items: ["TypeScript", "Rust"] },
      { name: "Tools", items: ["Docker"] },
    ];
    const original = JSON.parse(JSON.stringify(categories));
    calculateTechStackHeight(categories);
    expect(categories).toEqual(original);
  });
});
