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

  describe("multi-column layout", () => {
    it("should render categories as side-by-side columns", () => {
      const svg = renderTechStack(techStack, KanagawaTheme, 0, 0, 760);
      // 2 categories at 760px width = 380px per column
      expect(svg).toContain('transform="translate(0, 0)"');
      expect(svg).toContain('transform="translate(380, 0)"');
    });

    it("should evenly divide width across 4 categories", () => {
      const fourCats: TechStack = {
        categories: [
          { name: "A", items: ["a1"] },
          { name: "B", items: ["b1"] },
          { name: "C", items: ["c1"] },
          { name: "D", items: ["d1"] },
        ],
      };
      const svg = renderTechStack(fourCats, KanagawaTheme, 0, 0, 800);
      // 4 categories at 800px = 200px per column
      expect(svg).toContain('transform="translate(0, 0)"');
      expect(svg).toContain('transform="translate(200, 0)"');
      expect(svg).toContain('transform="translate(400, 0)"');
      expect(svg).toContain('transform="translate(600, 0)"');
    });

    it("should use full width for single category", () => {
      const singleCat: TechStack = {
        categories: [{ name: "Languages", items: ["TypeScript"] }],
      };
      const svg = renderTechStack(singleCat, KanagawaTheme, 0, 0, 760);
      // Single column at x=0
      expect(svg).toContain('transform="translate(0, 0)"');
    });

    it("should accept width parameter", () => {
      const svg = renderTechStack(techStack, KanagawaTheme, 0, 0, 600);
      // 2 categories at 600px = 300px per column
      expect(svg).toContain('transform="translate(300, 0)"');
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
      expect(svg).toContain("MyCustomTool");
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
