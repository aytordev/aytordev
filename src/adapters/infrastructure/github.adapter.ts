import type { Owner } from "../../config/schema";
import type { ContributionStats, GitHubDataPort } from "../../domain/ports/github-data.port";
import type { Commit } from "../../domain/value-objects/commit";
import type { FeaturedRepo } from "../../domain/value-objects/featured-repo";
import type { LanguageStat } from "../../domain/value-objects/language-stat";
import type { StreakInfo } from "../../domain/value-objects/streak-info";
import type { Result } from "../../shared/result";
import { ok } from "../../shared/result";

export const createMockGitHubAdapter = (): GitHubDataPort => ({
  getUserInfo: async (username: string): Promise<Result<Owner, Error>> =>
    ok({
      name: "Mock User",
      username,
      title: "Developer",
      location: "Internet",
      timezone: "UTC",
    }),

  getRecentCommits: async (username: string, limit: number): Promise<Result<Commit[], Error>> =>
    ok([
      {
        hash: "123456",
        message: "feat: mock commit",
        emoji: "🧪",
        type: "feat",
        relativeTime: "1h ago",
      },
    ]),

  getLanguageStats: async (username: string): Promise<Result<LanguageStat[], Error>> =>
    ok([
      { name: "TypeScript", percentage: 80, bytes: 1000, color: "#3178C6" },
      { name: "Rust", percentage: 20, bytes: 250, color: "#DEA584" },
    ]),

  getContributionStats: async (username: string): Promise<Result<ContributionStats, Error>> =>
    ok({ totalContributions: 500 }),

  getContributionStreak: async (username: string): Promise<Result<StreakInfo, Error>> =>
    ok({
      currentStreak: 10,
      longestStreak: 20,
      lastContributionDate: new Date(),
      isActive: true,
    }),

  getPinnedRepos: async (username: string, limit: number): Promise<Result<FeaturedRepo[], Error>> =>
    ok(
      [
        {
          name: "terminal-profile",
          nameWithOwner: `${username}/terminal-profile`,
          description: "Dynamic SVG terminal profile generator",
          stargazerCount: 234,
          primaryLanguage: { name: "TypeScript", color: "#3178C6" },
          updatedAt: "2026-02-10T12:00:00Z",
        },
        {
          name: "system",
          nameWithOwner: `${username}/system`,
          description: "NixOS config for all machines",
          stargazerCount: 89,
          primaryLanguage: { name: "Nix", color: "#5277C3" },
          updatedAt: "2026-02-09T08:00:00Z",
        },
        {
          name: "dotfiles",
          nameWithOwner: `${username}/dotfiles`,
          description: "Personal dev environment",
          stargazerCount: 45,
          primaryLanguage: { name: "Shell", color: "#89e051" },
          updatedAt: "2026-02-07T15:00:00Z",
        },
      ].slice(0, limit),
    ),
});
