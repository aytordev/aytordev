import { describe, expect, it } from "vitest";
import type { TerminalState } from "../../../domain/entities/terminal-state";
import { renderTerminal } from "../../../adapters/presentation/terminal-renderer";

describe("Terminal Renderer Orchestrator", () => {
  const mockState: TerminalState = {
    themeName: "kanagawa-wave",
    dimensions: { width: 800, height: 400 },
    greeting: "Hello",
    timestamp: new Date(),
    timeOfDay: "evening",
    owner: {
      name: "Test",
      username: "test",
      title: "Dev",
      location: "Local",
      timezone: "UTC",
    },
    session: {
      sessionName: "dev",
      windows: [],
      activeWindowIndex: 0,
      currentBranch: "main",
      stats: { cpuLoad: 0, memoryUsage: 0, uptime: "0" },
    },
    prompt: {
      directory: "~",
      gitBranch: null,
      gitStatus: null,
      nodeVersion: null,
      nixIndicator: false,
      time: "00:00",
    },
    content: {
      developerInfo: {
        name: "Test",
        username: "test",
        tagline: "Tag",
        location: "Loc",
      },
      techStack: { categories: [] },
      recentCommits: [],
      stats: { publicRepos: 0, followers: 0, following: 0, totalStars: 0 },
      streak: {
        currentStreak: 5,
        longestStreak: 10,
        lastContributionDate: new Date(),
        isActive: true,
      },
      languageStats: [],
      learningJourney: null,
      todayFocus: null,
      dailyQuote: null,
      careerTimeline: [],
      contactInfo: [],
      extraLines: [],
    },
  };

  it("should generate complete SVG", () => {
    const svg = renderTerminal(mockState);

    expect(svg).toContain("<svg");
    expect(svg).toContain("#1F1F28"); // Kanagawa Wave BG
    // Check for presence of layers
    expect(svg).toContain('id="tmux-bar"');
    expect(svg).toContain('id="prompt"');
    expect(svg).toContain('id="developer-info"');
    // Streak presence
    expect(svg).toContain('id="streak"');
    // Greeting presence
    expect(svg).toContain('id="greeting"');
    expect(svg).toContain("Hello");
  });

  it("should render ASCII Art when present", () => {
    const stateWithAscii = {
      ...mockState,
      content: {
        ...mockState.content,
        asciiArt: "  /\\_/\\  \n ( o.o ) ",
      },
    };
    const svg = renderTerminal(stateWithAscii);

    expect(svg).toContain(" /\\_/\\ ");
    expect(svg).toContain("( o.o )");
    // Check if it pushed content down? hard to check offset in string without parsing attributes
    // But presence is enough for now.
  });

  it("should respect custom dimensions", () => {
    const customState = {
      ...mockState,
      dimensions: { width: 1200, height: 600 },
    };
    const svg = renderTerminal(customState);

    expect(svg).toContain('viewBox="0 0 1200 600"');
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="600"');
  });

  describe("Strategy Pattern - Animation Mode Selection", () => {
    it("should use static renderer when animation is undefined", () => {
      const svg = renderTerminal(mockState);

      // Static mode should have all traditional sections
      expect(svg).toContain('id="greeting"');
      expect(svg).toContain('id="prompt"');
      expect(svg).toContain('id="developer-info"');
      // Should NOT have animation-specific elements
      expect(svg).not.toContain("clipPath");
      expect(svg).not.toContain("terminal-viewport");
      expect(svg).not.toContain("scrollable-content");
    });

    it("should use static renderer when animation.enabled is false", () => {
      const stateWithAnimationDisabled = {
        ...mockState,
        animation: {
          enabled: false,
          speed: 1,
          initialDelay: 0.5,
        },
      };
      const svg = renderTerminal(stateWithAnimationDisabled);

      // Static mode characteristics
      expect(svg).toContain('id="greeting"');
      expect(svg).toContain('id="prompt"');
      // Should NOT have animation-specific elements
      expect(svg).not.toContain("clipPath");
      expect(svg).not.toContain("terminal-viewport");
    });

    it("should use animated renderer when animation.enabled is true", () => {
      const stateWithAnimationEnabled = {
        ...mockState,
        animation: {
          enabled: true,
          speed: 1,
          initialDelay: 0.5,
        },
      };
      const svg = renderTerminal(stateWithAnimationEnabled);

      // Animated mode characteristics
      expect(svg).toContain("clipPath");
      expect(svg).toContain('id="terminal-viewport"');
      expect(svg).toContain('id="scrollable-content"');
      expect(svg).toContain("terminal-profile --info");
    });

    it("should include animation classes when in animated mode", () => {
      const stateWithAnimation = {
        ...mockState,
        animation: {
          enabled: true,
          speed: 1,
          initialDelay: 0.5,
        },
      };
      const svg = renderTerminal(stateWithAnimation);

      expect(svg).toContain('class="command-line animate');
      expect(svg).toContain('class="command-output animate"');
      expect(svg).toContain("animation-delay:");
    });

    it("should pass animation speed to animated renderer", () => {
      const stateWithFastAnimation = {
        ...mockState,
        animation: {
          enabled: true,
          speed: 2,
          initialDelay: 0.1,
        },
      };
      const svg = renderTerminal(stateWithFastAnimation);

      // With faster speed, animation delays should be shorter
      // Just verify animation is active
      expect(svg).toContain("animation-delay:");
    });

    it("should maintain backward compatibility - static mode unchanged", () => {
      const svgWithoutAnimation = renderTerminal(mockState);
      const svgWithAnimationDisabled = renderTerminal({
        ...mockState,
        animation: { enabled: false, speed: 1, initialDelay: 0 },
      });

      // Both should have same core elements
      expect(svgWithoutAnimation).toContain('id="greeting"');
      expect(svgWithAnimationDisabled).toContain('id="greeting"');
      expect(svgWithoutAnimation).toContain('id="tmux-bar"');
      expect(svgWithAnimationDisabled).toContain('id="tmux-bar"');
    });
  });
});
