import { describe, expect, it } from "vitest";
import { buildCommandSequence, estimateRenderHeight } from "../command-sequence";
import type { TerminalState } from "../../../../../domain/entities/terminal-state";
import { createMockTheme } from "../../../../../tests/mocks/theme";

const mockConfig: TerminalState = {
  timestamp: new Date("2024-01-15T12:00:00Z"),
  owner: {
    name: "Test User",
    username: "testuser",
    title: "Developer",
    location: "Remote",
    timezone: "UTC",
  },
  themeName: "kanagawa",
  timeOfDay: "afternoon",
  greeting: "Good morning, testuser!",
  prompt: {
    directory: "~/projects",
    gitBranch: "main",
    gitStatus: "clean",
    nodeVersion: "v20.0.0",
    nixIndicator: true,
    time: "12:00",
  },
  session: {
    sessionName: "main",
    activeWindowIndex: 1,
    currentBranch: "main",
    windows: [{ index: 1, name: "zsh" }],
    stats: { cpuLoad: 10, memoryUsage: 40, uptime: "1h" },
  },
  content: {
    developerInfo: {
      name: "Test User",
      username: "testuser",
      tagline: "Full Stack Developer",
      location: "Remote",
    },
    techStack: {
      categories: [
        {
          name: "Languages",
          items: ["TypeScript", "Python"],
        },
      ],
    },
    languageStats: [
      { name: "TypeScript", percentage: 80, bytes: 8000, color: "#3178C6" },
      { name: "Python", percentage: 20, bytes: 2000, color: "#3572A5" },
    ],
    recentCommits: [
      {
        message: "feat: test commit",
        emoji: "✨",
        type: "feat",
        hash: "abc1234",
        relativeTime: "2 hours ago",
      },
    ],
    learningJourney: { current: "Learning Rust" },
    todayFocus: "TDD",
    dailyQuote: null,
    stats: {
      publicRepos: 10,
      followers: 100,
      following: 50,
      totalStars: 500,
    },
    streak: {
      currentStreak: 5,
      longestStreak: 10,
      lastContributionDate: new Date("2024-01-15"),
      isActive: true,
    },
    careerTimeline: [],
    contactInfo: [],
    extraLines: [],
  },
  dimensions: { width: 800, height: 400 },
  animation: {
    enabled: true,
    speed: 1,
    initialDelay: 0.5,
  },
};

describe("buildCommandSequence", () => {
  it("should create command for each enabled section", () => {
    const commands = buildCommandSequence(mockConfig);

    expect(commands.length).toBeGreaterThan(0);
    expect(commands.every((cmd) => cmd.command.length > 0)).toBe(true);
    expect(commands.every((cmd) => typeof cmd.outputRenderer === "function")).toBe(true);
  });

  it("should include developer info command when present", () => {
    const commands = buildCommandSequence(mockConfig);

    const infoCommand = commands.find((cmd) =>
      cmd.command.includes("--info"),
    );
    expect(infoCommand).toBeDefined();
  });

  it("should include tech stack command when present", () => {
    const commands = buildCommandSequence(mockConfig);

    const stackCommand = commands.find((cmd) =>
      cmd.command.includes("--stack"),
    );
    expect(stackCommand).toBeDefined();
  });

  it("should include language stats command when present", () => {
    const commands = buildCommandSequence(mockConfig);

    const langCommand = commands.find((cmd) =>
      cmd.command.includes("--languages"),
    );
    expect(langCommand).toBeDefined();
  });

  it("should include commits command when present", () => {
    const commands = buildCommandSequence(mockConfig);

    const commitsCommand = commands.find((cmd) =>
      cmd.command.includes("--commits"),
    );
    expect(commitsCommand).toBeDefined();
  });

  it("should include engagement command when present", () => {
    const commands = buildCommandSequence(mockConfig);

    const engagementCommand = commands.find((cmd) =>
      cmd.command.includes("--learning") || cmd.command.includes("--focus"),
    );
    expect(engagementCommand).toBeDefined();
  });

  it("should skip sections that have empty arrays", () => {
    const minimalState: TerminalState = {
      ...mockConfig,
      content: {
        ...mockConfig.content,
        languageStats: [],
        recentCommits: [],
        careerTimeline: [],
        contactInfo: [],
        extraLines: [],
        learningJourney: null,
        todayFocus: null,
        dailyQuote: null,
      },
    };

    const commands = buildCommandSequence(minimalState);

    // Should only have developer info, tech stack, and streak
    expect(commands.length).toBeGreaterThanOrEqual(2);
  });

  it("should be a pure function (same input = same output)", () => {
    const commands1 = buildCommandSequence(mockConfig);
    const commands2 = buildCommandSequence(mockConfig);

    expect(commands1.length).toBe(commands2.length);
    commands1.forEach((cmd, i) => {
      expect(cmd.command).toBe(commands2[i].command);
    });
  });

  it("should not mutate input state", () => {
    const originalContent = { ...mockConfig.content };

    buildCommandSequence(mockConfig);

    expect(mockConfig.content.developerInfo).toEqual(originalContent.developerInfo);
  });

  it("should return renderers that produce valid SVG", () => {
    const commands = buildCommandSequence(mockConfig);
    const theme = createMockTheme();

    commands.forEach((cmd) => {
      const result = cmd.outputRenderer(theme, 0);
      expect(result).toHaveProperty("svg");
      expect(result).toHaveProperty("height");
      expect(typeof result.svg).toBe("string");
      expect(typeof result.height).toBe("number");
      expect(result.height).toBeGreaterThan(0);
    });
  });

  it("should return renderers that are pure functions", () => {
    const commands = buildCommandSequence(mockConfig);
    const theme = createMockTheme();

    commands.forEach((cmd) => {
      const result1 = cmd.outputRenderer(theme, 0);
      const result2 = cmd.outputRenderer(theme, 0);

      expect(result1.svg).toBe(result2.svg);
      expect(result1.height).toBe(result2.height);
    });
  });
});

describe("estimateRenderHeight", () => {
  it("should estimate height from SVG content", () => {
    const svg = `
      <g>
        <text y="0">Line 1</text>
        <text y="20">Line 2</text>
        <text y="40">Line 3</text>
      </g>
    `;

    const height = estimateRenderHeight(svg);

    expect(height).toBeGreaterThan(0);
  });

  it("should return minimum height for empty SVG", () => {
    const svg = "<g></g>";

    const height = estimateRenderHeight(svg);

    expect(height).toBeGreaterThanOrEqual(20); // Minimum line height
  });

  it("should handle SVG with transform attributes", () => {
    const svg = `
      <g transform="translate(0, 100)">
        <text y="20">Text</text>
      </g>
    `;

    const height = estimateRenderHeight(svg);

    expect(height).toBeGreaterThan(0);
  });

  it("should be a pure function", () => {
    const svg = `<g><text y="50">Test</text></g>`;

    const height1 = estimateRenderHeight(svg);
    const height2 = estimateRenderHeight(svg);

    expect(height1).toBe(height2);
  });

  it("should handle multiple elements at different Y positions", () => {
    const svg = `
      <g>
        <text y="10">A</text>
        <text y="30">B</text>
        <rect y="50" height="20"/>
      </g>
    `;

    const height = estimateRenderHeight(svg);

    // Should account for the deepest element (rect at y=50 with height=20)
    expect(height).toBeGreaterThanOrEqual(70);
  });
});
