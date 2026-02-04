import * as fs from "fs/promises";
import * as path from "path";
import { SystemClockAdapter } from "./adapters/clock.adapter";
import { NodeFileSystemAdapter } from "./adapters/file-system.adapter";
import { MockGitHubAdapter } from "./adapters/github.adapter";
import { loadConfigFromString } from "./config/loader";
import type { TerminalState } from "./domain/entities/terminal-state";
import { TerminalRenderer } from "./rendering/terminal-renderer";

async function main() {
  console.log("🚀 Starting Terminal Profile Generator...");

  const fsAdapter = new NodeFileSystemAdapter();
  const clockAdapter = new SystemClockAdapter();
  const githubAdapter = new MockGitHubAdapter();

  // 1. Load Config
  const configPath = path.resolve(process.cwd(), "terminal_profile.yml");
  if (!(await fsAdapter.exists(configPath))) {
    console.error(`❌ Config file not found at: ${configPath}`);
    process.exit(1);
  }

  const configContent = await fsAdapter.readFile(configPath);
  const configResult = loadConfigFromString(configContent);

  if (!configResult.ok) {
    console.error("❌ Invalid configuration:", configResult.error);
    process.exit(1);
  }

  const config = configResult.value;
  console.log(`✅ Loaded configuration for @${config.owner.username}`);

  // 2. Fetch Data (Mock for now)
  const [userInfo, commits, streak] = await Promise.all([
    githubAdapter.getUserInfo(config.owner.username),
    githubAdapter.getRecentCommits(config.owner.username, 5),
    githubAdapter.getContributionStreak(config.owner.username),
  ]);

  if (!userInfo.ok) throw userInfo.error;
  if (!commits.ok) throw commits.error;
  if (!streak.ok) throw streak.error; // In real app, might handle gracefully with defaults

  // 3. Build State
  // Note: Mapping Config+Data to Domain State
  const state: TerminalState = {
    themeName: config.theme,
    timestamp: new Date(),
    timeOfDay: clockAdapter.getTimeOfDay(config.owner.timezone),
    greeting: "Hello", // Logic for greeting could be sophisticated
    owner: config.owner, // Or userInfo.value if we prefer API data overlay
    session: {
      sessionName: "profile",
      activeWindowIndex: 1,
      currentBranch: "main",
      windows: [
        { index: 1, name: "zsh" },
        { index: 2, name: "nvim" },
      ], // Mock or Config driven?
      stats: { cpuLoad: 12, memoryUsage: 40, uptime: "3d 4h" },
    },
    prompt: {
      directory: "~/github/profile",
      gitBranch: "main",
      gitStatus: "clean",
      nodeVersion: process.version,
      nixIndicator: true, // we are in nix
      time: clockAdapter.formatTime(new Date(), config.owner.timezone),
    },
    content: {
      developerInfo: {
        name: config.owner.name,
        username: config.owner.username,
        tagline: config.owner.title,
        location: config.owner.location,
      },
      techStack: { categories: [] }, // Populate from config if schema has it? Schema layout had content blocks.
      // For now, using empty or mocks as schema didn't fully define content block structure in this phase
      recentCommits: commits.value,
      stats: { publicRepos: 10, followers: 50, following: 10, totalStars: 100 },
      streak: streak.value,
      languageStats: [],
      careerTimeline: [],
      contactInfo: [],
      extraLines: [],
      dailyQuote: null,
      learningJourney: null,
      todayFocus: null,
    },
  };

  // 4. Render
  console.log("🎨 Rendering SVG...");
  const renderer = new TerminalRenderer();
  const svg = renderer.render(state);

  // 5. Write Output
  const outputPath = path.resolve(process.cwd(), "profile.svg");
  await fs.writeFile(outputPath, svg);
  console.log(`✨ Generated profile at: ${outputPath}`);
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
