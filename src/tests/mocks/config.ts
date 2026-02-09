import type { Config } from "../../config/schema";

export const mockConfig: Config = {
  version: 2,
  profile_mode: "story-driven",
  owner: {
    name: "Test User",
    username: "testuser",
    title: "Developer",
    location: "Earth",
    timezone: "UTC",
  },
  system: {
    os: "NixOS",
    shell: "zsh",
    editor: "neovim",
    terminal: "ghostty",
    theme: "Kanagawa",
  },
  journey: [
    { year: 2020, icon: "🌱", title: "Started coding" },
    { year: 2024, icon: "🤖", title: "AI Engineering", tags: ["LLMs", "Agents"] },
  ],
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
  tech_stack: {
    categories: [{ name: "Languages", items: ["TypeScript", "Rust"] }],
  },
  featured_repos: {
    source: "stars",
    limit: 3,
  },
  contact: {
    cta: "Let's connect! 💬",
    items: [{ label: "GitHub", value: "@testuser", icon: "gh" }],
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
