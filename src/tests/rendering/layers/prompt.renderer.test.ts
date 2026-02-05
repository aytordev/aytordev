import { describe, expect, it } from "vitest";
import type { StarshipPrompt } from "../../../domain/entities/starship-prompt";
import { renderPrompt } from "../../../rendering/layers/prompt.renderer";
import { KanagawaTheme } from "../../../theme/kanagawa";

describe("Starship Prompt Renderer", () => {
  const prompt: StarshipPrompt = {
    directory: "~/Developer/terminal-profile",
    gitBranch: "feat/rendering",
    gitStatus: "dirty",
    nodeVersion: "v18.19.0",
    nixIndicator: true,
    time: "20:30",
  };

  const y = 50; // Arbitrary Y position for test

  it("should render directory", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y);
    expect(svg).toContain(prompt.directory);
    expect(svg).toContain('class="prompt__dir"');
  });

  it("should render git info when present", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y);
    expect(svg).toContain(prompt.gitBranch);
    expect(svg).toContain('class="prompt__git"');
  });

  it("should render nix indicator when valid", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y);
    expect(svg).toContain("❄️"); // Assuming snowflake or text for nix
    expect(svg).toContain('class="prompt__nix"');
  });

  it("should render node version", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y);
    expect(svg).toContain("⬢"); // Node icon
    expect(svg).toContain("v18.19.0");
    expect(svg).toContain('class="prompt__node"');
  });

  it("should render prompt indicator/arrow on a new line", () => {
    const svg = renderPrompt(prompt, KanagawaTheme, y);
    expect(svg).toContain("❯");
    expect(svg).toContain('class="prompt__indicator"');
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
    const svg = renderPrompt(minimalPrompt, KanagawaTheme, y);
    expect(svg).not.toContain('class="prompt__git"');
    expect(svg).not.toContain('class="prompt__nix"');
    expect(svg).toContain("~");
  });
});
