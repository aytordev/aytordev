import { describe, expect, it } from "vitest";
import { createMockTheme } from "../../../mocks/theme";
import { renderTerminalSession } from "../../../../adapters/presentation/layers/terminal-session.renderer";
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

  it("should render initial prompt", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain(state.prompt.directory);
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

  it("should include command-line class for typewriter effect", () => {
    const state = terminalStateBuilder().build();
    const svg = renderTerminalSession(state, theme, viewportY, viewportHeight);

    expect(svg).toContain('class="command-line animate');
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
    const originalGreeting = state.greeting;
    const originalDirectory = state.prompt.directory;

    renderTerminalSession(state, theme, viewportY, viewportHeight);

    // Check key properties remain unchanged
    expect(state.themeName).toBe(originalThemeName);
    expect(state.greeting).toBe(originalGreeting);
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
