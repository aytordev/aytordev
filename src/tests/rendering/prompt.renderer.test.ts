import { describe, expect, it } from "vitest";
import { renderPrompt } from "../../adapters/presentation/layers/prompt.renderer";
import { Theme } from "../../theme/types"; // Adjust import path
import { mockTerminalState } from "../mocks/terminal-state";

// Mock Theme
const mockTheme: Theme = {
  name: "kanagawa-wave",
  colors: {
    sumiInk0: "#16161D",

    sumiInk1: "#181820",
    sumiInk2: "#1a1a22",
    sumiInk3: "#1F1F28",
    sumiInk4: "#2A2A37",
    sumiInk5: "#363646",
    sumiInk6: "#54546D",
    waveBlue1: "#223249",
    waveBlue2: "#2D4F67",
    winterGreen: "#2B3328",
    winterYellow: "#494436",
    winterRed: "#43242B",
    winterBlue: "#252535",
    autumnGreen: "#76946A",
    autumnRed: "#C34043",
    autumnYellow: "#DCA561",
    samuraiRed: "#E82424",
    roninYellow: "#FF9E3B",
    springGreen: "#98BB6C",
    springBlue: "#7E9CD8",

    fujiWhite: "#DCD7BA",
    fujiGray: "#727169",
    oniViolet: "#957FB8",
    crystalBlue: "#7E9CD8",
    dragonBlue: "#658594",
    oldWhite: "#C8C093",
    text: "#DCD7BA",
    textMuted: "#727169",
    selection: "#2D4F67",
    border: "#16161D",

    bgTuft: "#16161D",
  },
} as unknown as Theme;

describe("Prompt Renderer (Redesign)", () => {
  const prompt = {
    ...mockTerminalState.prompt,
    gitStats: { added: 10, deleted: 5, modified: 2 },
  };

  it("should render left and right sides", () => {
    const svg = renderPrompt(prompt, mockTheme, 100, 800);

    // Left
    expect(svg).toContain(prompt.directory);
    expect(svg).toContain("git:main");

    // Right
    expect(svg).toContain("node");
    expect(svg).toContain("nix");
    expect(svg).toContain(prompt.time);

    // Stats
    expect(svg).toContain("+10");
    expect(svg).toContain("-5");
    expect(svg).toContain("~2");
  });

  it("should use text-anchor end for right items", () => {
    const svg = renderPrompt(prompt, mockTheme, 100, 800);
    expect(svg).toContain('text-anchor="end"');
  });
});
