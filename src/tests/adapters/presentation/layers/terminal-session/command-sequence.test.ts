import { describe, expect, it } from "vitest";
import {
  buildCommandSequence,
  estimateRenderHeight,
} from "../../../../../adapters/presentation/layers/terminal-session/command-sequence";
import type { TerminalState } from "../../../../../domain/entities/terminal-state";
import { terminalStateBuilder } from "../../../../__support__/builders";
import { TEST_ANIMATION } from "../../../../__support__/constants";
import { createMockTheme } from "../../../../mocks/theme";

const fullState = terminalStateBuilder()
  .withContent({
    neofetchData: {
      owner: {
        name: "Test User",
        username: "testuser",
        tagline: "Full Stack Developer",
        location: "Remote",
      },
      system: {
        os: "NixOS",
        shell: "zsh",
        editor: "neovim",
        terminal: "ghostty",
        theme: "Kanagawa",
      },
      stats: {
        totalCommits: 500,
        currentStreak: 5,
        publicRepos: 10,
      },
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
        emoji: "\u{2728}",
        type: "feat",
        hash: "abc1234",
        relativeTime: "2 hours ago",
      },
    ],
    contactInfo: [{ label: "GitHub", value: "https://github.com/testuser", icon: "github" }],
    featuredRepos: [
      {
        name: "my-repo",
        nameWithOwner: "testuser/my-repo",
        description: "A cool repo",
        stargazerCount: 42,
        primaryLanguage: { name: "TypeScript", color: "#3178C6" },
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    journey: [{ year: 2020, icon: "\u{1F331}", title: "Started coding" }],
    contactCta: "Let's connect! \u{1F4AC}",
  })
  .withAnimation({
    enabled: true,
    speed: TEST_ANIMATION.SPEED_NORMAL,
    initialDelay: 0.5,
  })
  .build();

describe("buildCommandSequence", () => {
  it("should return 7 commands when all sections are present", () => {
    const commands = buildCommandSequence(fullState);

    expect(commands.length).toBe(7);
  });

  it("should return commands in the correct story-driven order", () => {
    const commands = buildCommandSequence(fullState);

    expect(commands[0].command).toBe("neofetch");
    expect(commands[1].command).toBe("cat journey.md");
    expect(commands[2].command).toBe("gh api /langs --sort usage");
    expect(commands[3].command).toBe("cat ~/.stack");
    expect(commands[4].command).toBe("git log --oneline -5");
    expect(commands[5].command).toBe("gh repo list --limit 3 --sort stars");
    expect(commands[6].command).toContain("echo");
  });

  it("should create valid renderers for each command", () => {
    const commands = buildCommandSequence(fullState);
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

  it("should skip sections with empty data", () => {
    const minimalState: TerminalState = {
      ...fullState,
      content: {
        ...fullState.content,
        languageStats: [],
        recentCommits: [],
        contactInfo: [],
        featuredRepos: [],
        journey: [],
      },
    };

    const commands = buildCommandSequence(minimalState);

    // Should have neofetch + tech stack = 2
    expect(commands.length).toBe(2);
    expect(commands[0].command).toBe("neofetch");
    expect(commands[1].command).toBe("cat ~/.stack");
  });

  it("should be a pure function (same input = same output)", () => {
    const commands1 = buildCommandSequence(fullState);
    const commands2 = buildCommandSequence(fullState);

    expect(commands1.length).toBe(commands2.length);
    commands1.forEach((cmd, i) => {
      expect(cmd.command).toBe(commands2[i].command);
    });
  });

  it("should not mutate input state", () => {
    const originalOwner = { ...fullState.content.neofetchData.owner };

    buildCommandSequence(fullState);

    expect(fullState.content.neofetchData.owner).toEqual(originalOwner);
  });

  it("should return renderers that are pure functions", () => {
    const commands = buildCommandSequence(fullState);
    const theme = createMockTheme();

    commands.forEach((cmd) => {
      const result1 = cmd.outputRenderer(theme, 0);
      const result2 = cmd.outputRenderer(theme, 0);

      expect(result1.svg).toBe(result2.svg);
      expect(result1.height).toBe(result2.height);
    });
  });

  it("should calculate tech stack height correctly", () => {
    const commands = buildCommandSequence(fullState);
    const theme = createMockTheme();

    const stackCommand = commands.find((cmd) => cmd.command === "cat ~/.stack");
    expect(stackCommand).toBeDefined();

    const result = stackCommand!.outputRenderer(theme, 0);
    // PADDING(10) + 1 * LINE_HEIGHT(30) = 40
    expect(result.height).toBe(40);
  });

  it("should include contact CTA in echo command", () => {
    const commands = buildCommandSequence(fullState);

    const echoCommand = commands.find((cmd) => cmd.command.includes("echo"));
    expect(echoCommand).toBeDefined();
    expect(echoCommand!.command).toContain("connect");
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

    expect(height).toBeGreaterThanOrEqual(20);
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

    expect(height).toBeGreaterThanOrEqual(70);
  });
});
