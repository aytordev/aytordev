import { describe, expect, it } from "vitest";
import type { TerminalState } from "../../domain/entities/terminal-state";

describe("Terminal Entities", () => {
  it("should structure TmuxSession correctly", () => {
    const session: import("../../domain/entities/tmux-session").TmuxSession = {
      sessionName: "dev",
      windows: [{ name: "vim", index: 1 }],
      activeWindowIndex: 1,
      currentBranch: "main",
      stats: {
        cpuLoad: 1.5,
        memoryUsage: 4096,
        uptime: "2d",
      },
    };
    expect(session.windows).toHaveLength(1);
    expect(session.stats.cpuLoad).toBe(1.5);
  });

  it("should structure StarshipPrompt correctly", () => {
    const prompt: import("../../domain/entities/starship-prompt").StarshipPrompt = {
      directory: "~/project",
      gitBranch: "feat/test",
      gitStatus: "dirty",
      nodeVersion: "v18",
      nixIndicator: true,
      time: "12:00",
    };
    expect(prompt.nixIndicator).toBe(true);
    expect(prompt.gitStatus).toBe("dirty");
  });

  it("should structure TerminalContent correctly", () => {
    const content: Partial<import("../../domain/entities/terminal-content").TerminalContent> = {
      developerInfo: {
        name: "Dev",
        username: "dev",
        tagline: "Coding",
        location: "Web",
      },
      stats: {
        publicRepos: 10,
        followers: 5,
        following: 2,
        totalStars: 100,
      },
    };
    expect(content.developerInfo?.username).toBe("dev");
  });

  it("should structure TerminalState correctly", () => {
    // Top-level aggregate test
    const state: Partial<TerminalState> = {
      greeting: "Hello",
      themeName: "kanagawa-wave",
      timestamp: new Date(),
    };
    expect(state.timestamp).toBeInstanceOf(Date);
  });
});
