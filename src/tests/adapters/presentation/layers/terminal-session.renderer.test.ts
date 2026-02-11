import { describe, expect, it } from "vitest";
import {
  generateCursorPositions,
  generateKeyTimesForTyping,
  generateValuesForTyping,
  renderTerminalSession,
} from "../../../../adapters/presentation/layers/terminal-session.renderer";
import { terminalStateBuilder } from "../../../__support__/builders";
import { TEST_VIEWPORT } from "../../../__support__/constants";
import { svgAssertions } from "../../../__support__/helpers";
import { createMockTheme } from "../../../mocks/theme";

describe("renderTerminalSession", () => {
  const theme = createMockTheme();
  const viewportY = TEST_VIEWPORT.Y_OFFSET;
  const viewportHeight = TEST_VIEWPORT.HEIGHT;

  it("should return valid SVG string", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    svgAssertions.isValidGroup(svg);
  });

  it("should create clipPath for viewport simulation", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    svgAssertions.hasClipPath(svg, "terminal-viewport");
    expect(svg).toContain(`y="${viewportY}"`);
    expect(svg).toContain(`height="${viewportHeight}"`);
  });

  it("should use clipPath on scrollable content group", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain('clip-path="url(#terminal-viewport)"');
    expect(svg).toContain('id="scrollable-content"');
  });

  it("should render initial prompt with left side", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain(state.prompt.directory);
  });

  it("should render prompt with right side elements (time, node, nix)", () => {
    const state = terminalStateBuilder()
      .with({
        prompt: {
          directory: "~/dev",
          gitBranch: "main",
          gitStatus: "clean",
          nodeVersion: "v18.19.0",
          nixIndicator: true,
          time: "23:50",
        },
      })
      .build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain("23:50");
    expect(svg).toContain("nix");
    expect(svg).toContain("v18.19.0");
    expect(svg).toContain("node");
  });

  it("should render commands based on content sections", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain("neofetch");
  });

  it("should include SMIL animation timing in command elements", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    // Prompt uses SMIL <set> with begin attribute, output uses SMIL <animate>
    expect(svg).toContain('attributeName="opacity"');
    expect(svg).toContain("begin=");
  });

  it("should include command-line class with clipPath animation", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain('class="command-line terminal-text"');
    expect(svg).toContain('clip-path="url(#typing-clip-');
  });

  it("should include SMIL fade-in for output elements", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    // Output uses inline SMIL <animate> for fade-in instead of CSS classes
    expect(svg).toContain('opacity="0"');
    expect(svg).toContain('<animate attributeName="opacity" from="0" to="1"');
  });

  it("should generate scroll keyframes when content exceeds viewport", () => {
    const state = terminalStateBuilder()
      .withContent({
        neofetchData: {
          owner: {
            name: "Aytor Dev",
            username: "aytordev",
            tagline: "Software Engineer",
            location: "Earth",
          },
          system: {
            os: "NixOS",
            shell: "zsh",
            editor: "neovim",
            terminal: "ghostty",
            theme: "Kanagawa",
          },
          stats: { totalCommits: 500, currentStreak: 10, publicRepos: 10 },
        },
        techStack: {
          categories: [{ name: "Languages", items: ["TypeScript"] }],
        },
        languageStats: [
          { name: "TypeScript", percentage: 80, color: "#3178C6", bytes: 10000 },
          { name: "Rust", percentage: 20, color: "#CE422B", bytes: 2500 },
        ],
        recentCommits: [
          {
            hash: "abc123",
            message: "feat: add feature",
            emoji: "✨",
            type: "feat",
            relativeTime: "2 hours ago",
          },
        ],
        contactInfo: [
          {
            label: "GitHub",
            value: "https://github.com/aytordev",
            icon: "github",
          },
        ],
        featuredRepos: [],
        journey: [],
        contactCta: "Let's connect! \u{1F4AC}",
      })
      .build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain("@keyframes scroll-");
  });

  it("should not generate scroll keyframes when content fits viewport", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, 2000);

    expect(svg).not.toContain("@keyframes scroll-");
  });

  it("should be a pure function (same input = same output)", () => {
    const state = terminalStateBuilder().build();
    const svg1 = renderTerminalSession(state, theme, viewportY, viewportHeight);
    const svg2 = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg1).toBe(svg2);
  });

  it("should not mutate input state", () => {
    const state = terminalStateBuilder().build();
    const originalThemeName = state.themeName;
    const originalDirectory = state.prompt.directory;

    renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(state.themeName).toBe(originalThemeName);
    expect(state.prompt.directory).toBe(originalDirectory);
    expect(state.content).toBeDefined();
    expect(state.content.neofetchData).toBeDefined();
  });

  it("should include style tag for scroll keyframes", () => {
    const state = terminalStateBuilder()
      .withContent({
        neofetchData: {
          owner: {
            name: "Aytor Dev",
            username: "aytordev",
            tagline: "Software Engineer",
            location: "Earth",
          },
          system: {
            os: "NixOS",
            shell: "zsh",
            editor: "neovim",
            terminal: "ghostty",
            theme: "Kanagawa",
          },
          stats: { totalCommits: 500, currentStreak: 5, publicRepos: 5 },
        },
        techStack: {
          categories: [{ name: "Languages", items: ["TypeScript"] }],
        },
        languageStats: [{ name: "TypeScript", percentage: 100, color: "#3178C6", bytes: 10000 }],
        recentCommits: [
          {
            hash: "abc123",
            message: "feat: add feature",
            emoji: "✨",
            type: "feat",
            relativeTime: "2 hours ago",
          },
        ],
        contactInfo: [{ label: "GitHub", value: "https://github.com", icon: "github" }],
        featuredRepos: [],
        journey: [],
        contactCta: "Let's connect! \u{1F4AC}",
      })
      .build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain("<style>");
    expect(svg).toContain("</style>");
  });

  it("should handle minimal content gracefully", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain(state.prompt.directory);
    expect(svg).toContain("clipPath");
  });

  it("should use animation timing from state if provided", () => {
    const state = terminalStateBuilder()
      .withAnimation({
        enabled: true,
        speed: 2,
        initialDelay: 0.5,
      })
      .build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    // SMIL animations use begin= attribute for timing
    expect(svg).toContain("begin=");
    expect(svg).toContain('attributeName="opacity"');
  });
});

describe("generateKeyTimesForTyping", () => {
  it("should generate correct keyTimes for simple case", () => {
    const result = generateKeyTimesForTyping(3);
    expect(result).toBe("0;0.3333333333333333;0.6666666666666666;1");
  });

  it("should generate correct keyTimes for single character", () => {
    const result = generateKeyTimesForTyping(1);
    expect(result).toBe("0;1");
  });

  it("should generate correct keyTimes for zero characters", () => {
    const result = generateKeyTimesForTyping(0);
    expect(result).toBe("0");
  });

  it("should be a pure function (same input = same output)", () => {
    const result1 = generateKeyTimesForTyping(5);
    const result2 = generateKeyTimesForTyping(5);
    expect(result1).toBe(result2);
  });

  it("should generate increasing values from 0 to 1", () => {
    const result = generateKeyTimesForTyping(10);
    const values = result.split(";").map(Number);

    expect(values[0]).toBe(0);
    expect(values[values.length - 1]).toBe(1);

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it("should generate charCount + 1 entries", () => {
    const charCount = 7;
    const result = generateKeyTimesForTyping(charCount);
    const entries = result.split(";");
    expect(entries.length).toBe(charCount + 1);
  });
});

describe("generateValuesForTyping", () => {
  it("should generate correct width values", () => {
    const result = generateValuesForTyping(3, 10);
    expect(result).toBe("10;20;30;40");
  });

  it("should handle single character", () => {
    const result = generateValuesForTyping(1, 8.4);
    expect(result).toBe("8.4;16.8");
  });

  it("should scale with character width", () => {
    const result1 = generateValuesForTyping(2, 5);
    const result2 = generateValuesForTyping(2, 10);

    expect(result1).toBe("5;10;15");
    expect(result2).toBe("10;20;30");
  });

  it("should be a pure function", () => {
    const result1 = generateValuesForTyping(5, 8.4);
    const result2 = generateValuesForTyping(5, 8.4);
    expect(result1).toBe(result2);
  });

  it("should generate charCount + 1 entries", () => {
    const charCount = 10;
    const result = generateValuesForTyping(charCount, 8.4);
    const entries = result.split(";");
    expect(entries.length).toBe(charCount + 1);
  });

  it("should generate increasing values", () => {
    const result = generateValuesForTyping(5, 8);
    const values = result.split(";").map(Number);

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe("generateCursorPositions", () => {
  it("should generate correct cursor positions", () => {
    const result = generateCursorPositions(3, 10, 0);
    expect(result).toBe("10;20;30;40");
  });

  it("should offset by startX", () => {
    const result = generateCursorPositions(2, 10, 50);
    expect(result).toBe("60;70;80");
  });

  it("should handle different character widths", () => {
    const result1 = generateCursorPositions(2, 5, 10);
    const result2 = generateCursorPositions(2, 8.4, 10);

    expect(result1).toBe("15;20;25");
    const positions = result2.split(";").map(Number);
    expect(positions[0]).toBeCloseTo(18.4, 1);
    expect(positions[1]).toBeCloseTo(26.8, 1);
    expect(positions[2]).toBeCloseTo(35.2, 1);
  });

  it("should be a pure function", () => {
    const result1 = generateCursorPositions(5, 8.4, 10);
    const result2 = generateCursorPositions(5, 8.4, 10);
    expect(result1).toBe(result2);
  });

  it("should generate charCount + 1 entries", () => {
    const charCount = 8;
    const result = generateCursorPositions(charCount, 8.4, 10);
    const entries = result.split(";");
    expect(entries.length).toBe(charCount + 1);
  });

  it("should generate increasing positions", () => {
    const result = generateCursorPositions(5, 8, 10);
    const positions = result.split(";").map(Number);

    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
  });

  it("should start at startX + charWidth", () => {
    const startX = 20;
    const charWidth = 8.4;
    const result = generateCursorPositions(3, charWidth, startX);
    const positions = result.split(";").map(Number);
    expect(positions[0]).toBe(startX + charWidth);
  });
});
