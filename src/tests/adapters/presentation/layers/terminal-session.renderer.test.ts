import { describe, expect, it } from "vitest";
import { createMockTheme } from "../../../mocks/theme";
import {
  renderTerminalSession,
  generateKeyTimesForTyping,
  generateValuesForTyping,
  generateCursorPositions,
} from "../../../../adapters/presentation/layers/terminal-session.renderer";
import { terminalStateBuilder } from "../../../__support__/builders";
import { svgAssertions } from "../../../__support__/helpers";
import { TEST_VIEWPORT } from "../../../__support__/constants";

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

    // Right side should include all elements
    expect(svg).toContain("23:50"); // Time
    expect(svg).toContain("nix"); // Nix indicator
    expect(svg).toContain("v18.19.0"); // Node version
    expect(svg).toContain("node"); // Node label
  });

  it("should render commands based on content sections", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain("terminal-profile --info");
  });

  it("should include animation delays in command elements", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain("animation-delay:");
  });

  it("should include command-line class with clipPath animation", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    // Command line now uses clipPath for typing animation instead of CSS class
    expect(svg).toContain('class="command-line terminal-text"');
    expect(svg).toContain('clip-path="url(#typing-clip-');
  });

  it("should include command-output class for fade-in effect", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain('class="command-output animate"');
  });

  it("should generate scroll keyframes when content exceeds viewport", () => {
    const state = terminalStateBuilder()
      .withContent({
        developerInfo: {
          name: "Aytor Dev",
          username: "aytordev",
          tagline: "Software Engineer",
          location: "Earth",
        },
        techStack: {
          categories: [{ name: "Languages", items: ["TypeScript"] }],
        },
        languageStats: [
          {
            name: "TypeScript",
            percentage: 80,
            color: "#3178C6",
            bytes: 10000,
          },
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
        stats: {
          publicRepos: 10,
          followers: 50,
          following: 30,
          totalStars: 100,
        },
        careerTimeline: [],
        learningJourney: { current: "Learning Rust" },
        todayFocus: null,
        dailyQuote: null,
        contactInfo: [
          {
            label: "GitHub",
            value: "https://github.com/aytordev",
            icon: "github",
          },
        ],
        streak: {
          currentStreak: 10,
          longestStreak: 20,
          lastContributionDate: new Date(),
          isActive: true,
        },
        extraLines: [],
      })
      .build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    // With many sections, should generate scroll animations
    expect(svg).toContain("@keyframes scroll-");
  });

  it("should not generate scroll keyframes when content fits viewport", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(
      state,
      theme,
      viewportY,
      2000, // Very large viewport to ensure content fits with new spacing
    );

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

    // Check key properties remain unchanged
    expect(state.themeName).toBe(originalThemeName);
    expect(state.prompt.directory).toBe(originalDirectory);
    // Check that content object is not mutated
    expect(state.content).toBeDefined();
    expect(state.content.developerInfo).toBeDefined();
  });

  it("should include style tag for scroll keyframes", () => {
    const state = terminalStateBuilder()
      .withContent({
        developerInfo: {
          name: "Aytor Dev",
          username: "aytordev",
          tagline: "Software Engineer",
          location: "Earth",
        },
        techStack: {
          categories: [{ name: "Languages", items: ["TypeScript"] }],
        },
        languageStats: [
          {
            name: "TypeScript",
            percentage: 100,
            color: "#3178C6",
            bytes: 10000,
          },
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
        stats: { publicRepos: 5, followers: 20, following: 15, totalStars: 50 },
        careerTimeline: [],
        learningJourney: { current: "Learning" },
        todayFocus: null,
        dailyQuote: null,
        contactInfo: [{ label: "GitHub", value: "https://github.com", icon: "github" }],
        streak: {
          currentStreak: 5,
          longestStreak: 10,
          lastContributionDate: new Date(),
          isActive: true,
        },
        extraLines: [],
      })
      .build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain("<style>");
    expect(svg).toContain("</style>");
  });

  it("should handle minimal content gracefully", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    // Should still render initial prompt
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

    // With speed=2, timing should be adjusted
    // This is indirectly tested through animation-delay values
    expect(svg).toContain("animation-delay:");
  });
});

describe("generateKeyTimesForTyping", () => {
  it("should generate correct keyTimes for simple case", () => {
    const result = generateKeyTimesForTyping(3);
    
    // Should generate 4 entries (0, 1, 2, 3)
    expect(result).toBe("0;0.3333333333333333;0.6666666666666666;1");
  });

  it("should generate correct keyTimes for single character", () => {
    const result = generateKeyTimesForTyping(1);
    
    // Should generate 2 entries (0, 1)
    expect(result).toBe("0;1");
  });

  it("should generate correct keyTimes for zero characters", () => {
    const result = generateKeyTimesForTyping(0);
    
    // Should generate 1 entry (0)
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
    
    // Should start at 0 and end at 1
    expect(values[0]).toBe(0);
    expect(values[values.length - 1]).toBe(1);
    
    // Should be monotonically increasing
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
    
    // Each step: (i * 10 + 10)
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
    
    // Should be monotonically increasing
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe("generateCursorPositions", () => {
  it("should generate correct cursor positions", () => {
    const result = generateCursorPositions(3, 10, 0);
    
    // Each step: (0 + i * 10 + 10)
    expect(result).toBe("10;20;30;40");
  });

  it("should offset by startX", () => {
    const result = generateCursorPositions(2, 10, 50);
    
    // Each step: (50 + i * 10 + 10)
    expect(result).toBe("60;70;80");
  });

  it("should handle different character widths", () => {
    const result1 = generateCursorPositions(2, 5, 10);
    const result2 = generateCursorPositions(2, 8.4, 10);

    expect(result1).toBe("15;20;25");
    // Parse and compare as numbers to avoid floating point precision issues
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
    
    // Should be monotonically increasing
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
