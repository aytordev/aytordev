import type { Config } from "../../config/schema";

export const mockConfig: Config = {
  version: 1,
  owner: {
    name: "Test User",
    username: "testuser",
    title: "Developer",
    location: "Earth",
    timezone: "UTC",
  },
  theme: "kanagawa-wave",
  dimensions: { width: 800, height: 400 },
  tmux: {
    session_name: "dev",
    windows: ["zsh", "nvim"],
    show_stats: true,
  },
  prompt: {
    show_git: true,
    show_node: true,
    show_nix: true,
    show_time: true,
  },
  content: {
    developer_info: { enabled: true },
    tech_stack: { enabled: true, categories: [] },
    language_stats: { enabled: true, max_languages: 5, show_other: true },
    commits: { enabled: true, max_count: 5 },
    streak: { enabled: true },
    contact: { enabled: true, items: [] },
    extra_lines: [],
  },
  growth: {
    powered_by: { enabled: true, text: "Powered by" },
  },
  effects: {
    cursor_blink: true,
    gradient_bars: true,
    subtle_glow: false,
  },
  github: {
    max_repos: 10,
    include_private: false,
  },
};
