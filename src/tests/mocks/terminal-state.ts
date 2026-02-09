import type { TerminalState } from "../../domain/entities/terminal-state";

export const mockTerminalState: TerminalState = {
  themeName: "kanagawa-wave",
  dimensions: { width: 800, height: 600 },
  timestamp: new Date("2024-02-01T12:00:00Z"),
  timeOfDay: "afternoon",
  owner: {
    name: "Test User",
    username: "testuser",
    title: "Developer",
    location: "Internet",
    timezone: "UTC",
  },
  session: {
    sessionName: "dev",
    activeWindowIndex: 1,
    currentBranch: "main",
    windows: [
      { index: 1, name: "zsh" },
      { index: 2, name: "nvim" },
    ],
    stats: { cpuLoad: 10, memoryUsage: 40, uptime: "2d 4h" },
  },
  prompt: {
    directory: "~/projects/app",
    gitBranch: "main",
    gitStatus: "clean",
    nodeVersion: "v20.0.0",
    nixIndicator: true,
    time: "12:00",
  },
  content: {
    neofetchData: {
      owner: {
        name: "Test User",
        username: "testuser",
        tagline: "Building cool things",
        location: "Internet",
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
    journey: [],
    techStack: { categories: [] },
    recentCommits: [],
    languageStats: [],
    featuredRepos: [],
    contactInfo: [],
    contactCta: "Let's connect! \u{1F4AC}",
  },
};
