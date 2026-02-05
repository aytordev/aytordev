import { describe, expect, it } from "vitest";
import type { TechStack } from "../../../domain/value-objects/tech-stack";
import { renderTechStack } from "../../../rendering/layers/tech-stack.renderer";
import { KanagawaTheme } from "../../../theme/kanagawa";

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
