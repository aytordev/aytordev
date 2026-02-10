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

  it("should render icons without text labels", () => {
    const svg = renderTechStack(techStack, KanagawaTheme);
    expect(svg).toContain("<path");
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).not.toContain('class="stack__item"');
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

  describe("row layout", () => {
    it("should stack categories as vertical rows", () => {
      const svg = renderTechStack(techStack, KanagawaTheme);
      // 2 categories stacked vertically at LINE_HEIGHT=26
      expect(svg).toContain('transform="translate(0, 0)"');
      expect(svg).toContain('transform="translate(0, 26)"');
    });

    it("should stack 4 categories vertically", () => {
      const fourCats: TechStack = {
        categories: [
          { name: "A", items: ["a1"] },
          { name: "B", items: ["b1"] },
          { name: "C", items: ["c1"] },
          { name: "D", items: ["d1"] },
        ],
      };
      const svg = renderTechStack(fourCats, KanagawaTheme);
      expect(svg).toContain('transform="translate(0, 0)"');
      expect(svg).toContain('transform="translate(0, 26)"');
      expect(svg).toContain('transform="translate(0, 52)"');
      expect(svg).toContain('transform="translate(0, 78)"');
    });

    it("should render single category at origin", () => {
      const singleCat: TechStack = {
        categories: [{ name: "Languages", items: ["TypeScript"] }],
      };
      const svg = renderTechStack(singleCat, KanagawaTheme);
      expect(svg).toContain('transform="translate(0, 0)"');
    });
  });

  describe("icon rendering", () => {
    it("should render SVG path icons for known technologies", () => {
      const svg = renderTechStack(techStack, KanagawaTheme);
      expect(svg).toContain("<path");
      expect(svg).toContain('viewBox="0 0 24 24"');
    });

    it("should use technology brand color for icon fill", () => {
      const svg = renderTechStack(techStack, KanagawaTheme);
      // TypeScript color: #3178C6
      expect(svg).toContain('fill="#3178C6"');
    });

    it("should render fallback circle for unknown technologies", () => {
      const unknownStack: TechStack = {
        categories: [{ name: "Custom", items: ["MyCustomTool"] }],
      };
      const svg = renderTechStack(unknownStack, KanagawaTheme);
      expect(svg).toContain("<circle");
      expect(svg).not.toContain("<path");
    });
  });

  describe("purity", () => {
    it("should be a pure function (same input produces same output)", () => {
      const result1 = renderTechStack(techStack, KanagawaTheme);
      const result2 = renderTechStack(techStack, KanagawaTheme);
      expect(result1).toBe(result2);
    });

    it("should not mutate input", () => {
      const input: TechStack = {
        categories: [{ name: "Languages", items: ["TypeScript", "Rust"] }],
      };
      const original = JSON.parse(JSON.stringify(input));
      renderTechStack(input, KanagawaTheme);
      expect(input).toEqual(original);
    });
  });
});

describe("calculateTechStackHeight", () => {
  it("should return 0 for empty categories", () => {
    expect(calculateTechStackHeight([])).toBe(0);
  });

  it("should calculate height for single category", () => {
    const categories = [{ name: "Languages", items: ["TypeScript", "Rust", "Go"] }];
    // (1-1) * LINE_HEIGHT(26) + ICON_SIZE(22) = 22
    expect(calculateTechStackHeight(categories)).toBe(22);
  });

  it("should scale height with number of categories", () => {
    const categories = [
      { name: "Languages", items: ["TypeScript", "Rust", "Go"] },
      { name: "Tools", items: ["Docker"] },
    ];
    // (2-1) * LINE_HEIGHT(26) + ICON_SIZE(22) = 48
    expect(calculateTechStackHeight(categories)).toBe(48);
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
