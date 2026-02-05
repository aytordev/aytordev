import type { Owner } from "../config/schema";
import type {
  ContributionStats,
  GitHubDataPort,
} from "../domain/ports/github-data.port";
import type { Commit } from "../domain/value-objects/commit";
import type { LanguageStat } from "../domain/value-objects/language-stat";
import type { StreakInfo } from "../domain/value-objects/streak-info";
import type { Result } from "../shared/result";
import { ok } from "../shared/result";

export class MockGitHubAdapter implements GitHubDataPort {
  async getUserInfo(username: string): Promise<Result<Owner, Error>> {
    return ok({
      name: "Mock User",
      username,
      title: "Developer",
      location: "Internet",
      timezone: "UTC",
    });
  }

  async getRecentCommits(
    username: string,
    limit: number,
  ): Promise<Result<Commit[], Error>> {
    return ok([
      {
        hash: "123456",
        message: "feat: mock commit",
        emoji: "🧪",
        type: "feat",
        relativeTime: "1h ago",
      },
    ]);
  }

  async getLanguageStats(
    username: string,
  ): Promise<Result<LanguageStat[], Error>> {
    return ok([
      { name: "TypeScript", percentage: 80, bytes: 1000, color: "#3178C6" },
      { name: "Rust", percentage: 20, bytes: 250, color: "#DEA584" },
    ]);
  }

  async getContributionStats(
    username: string,
  ): Promise<Result<ContributionStats, Error>> {
    return ok({ totalContributions: 500 });
  }

  async getContributionStreak(
    username: string,
  ): Promise<Result<StreakInfo, Error>> {
    return ok({
      currentStreak: 10,
      longestStreak: 20,
      lastContributionDate: new Date(),
      isActive: true,
    });
  }
}
