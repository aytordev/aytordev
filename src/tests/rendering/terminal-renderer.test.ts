import { describe, expect, it } from "vitest";
import type { TerminalState } from "../../domain/entities/terminal-state";
import { TerminalRenderer } from "../../rendering/terminal-renderer";

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
    const renderer = new TerminalRenderer();
    const svg = renderer.render(mockState);

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
});
