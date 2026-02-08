import { describe, expect, it } from "vitest";
import { renderPrompt } from "../../../../adapters/presentation/layers/prompt.renderer";
import type { StarshipPrompt } from "../../../../domain/entities/starship-prompt";
import { KanagawaTheme } from "../../../../theme/kanagawa";
import { svgAssertions } from "../../../__support__/helpers";

describe("Starship Prompt Renderer", () => {
  const prompt: StarshipPrompt = {
    directory: "/home/dev/terminal-profile",
    gitBranch: "feat/rendering",
    gitStatus: "dirty",

    gitStats: { added: 12, deleted: 3, modified: 0 },
    nodeVersion: "v18.19.0",
    nixIndicator: true,
    time: "20:30",
  };

  const y = 50; // Arbitrary Y position for test
  const width = 800;

  it("should render left side items (Directory, Git)", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y, width);
    // Directory
    svgAssertions.hasText(svg, prompt.directory);
    // Git
    svgAssertions.hasText(svg, "git:feat/rendering");
    svgAssertions.hasText(svg, "?"); // Dirty indicator
  });

  it("should render right side items (Time, Nix, Node, GitStats)", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y, width);

    // Time
    svgAssertions.hasText(svg, "20:30");

    // Nix
    svgAssertions.hasText(svg, "nix");
    svgAssertions.hasText(svg, "❄️");

    // Node
    svgAssertions.hasText(svg, "node");
    svgAssertions.hasText(svg, "v18.19.0");
    svgAssertions.hasText(svg, "⬢");

    // Git Stats
    svgAssertions.hasText(svg, "+12");
    svgAssertions.hasText(svg, "-3");
    // Modified is 0, so should NOT be present (based on my recent change)
    expect(svg).not.toContain("~");
  });

  it("should use text-anchor end for right alignment", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y, width);
    expect(svg).toContain('text-anchor="end"');
  });

  it("should NOT render the prompt symbol (❯)", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y, width);
    expect(svg).not.toContain("❯");
  });

  it("should render blinking cursor at x=10", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y, width);
    svgAssertions.hasClass(svg, "cursor");
    expect(svg).toContain('x="10"');
  });

  it("should handle missing optional fields", () => {
    const minimalPrompt: StarshipPrompt = {
      directory: "~",
      gitBranch: null,
      gitStatus: null,
      nodeVersion: null,
      nixIndicator: false,
      time: "10:00",
    };
    const svg = renderPrompt(minimalPrompt, KanagawaTheme, y, width);

    svgAssertions.hasText(svg, "~");
    expect(svg).not.toContain("git:");
    expect(svg).not.toContain("node");
    expect(svg).not.toContain("nix");
  });
});
