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
    ok([
      {
        name: "mock-repo",
        nameWithOwner: `${username}/mock-repo`,
        description: "A mock repository",
        stargazerCount: 42,
        primaryLanguage: { name: "TypeScript", color: "#3178C6" },
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ]),
});
