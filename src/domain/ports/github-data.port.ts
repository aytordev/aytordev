import type { Result } from "../../shared/result";
import type { Commit } from "../value-objects/commit";
import type { FeaturedRepo } from "../value-objects/featured-repo";
import type { LanguageStat } from "../value-objects/language-stat";
import type { Owner } from "../value-objects/owner";
import type { StreakInfo } from "../value-objects/streak-info";

export interface ContributionStats {
  readonly totalContributions: number;
}

export interface GitHubDataPort {
  getUserInfo(username: string): Promise<Result<Owner, Error>>;
  getRecentCommits(username: string, limit: number): Promise<Result<Commit[], Error>>;
  getLanguageStats(username: string): Promise<Result<LanguageStat[], Error>>;
  getContributionStats(username: string): Promise<Result<ContributionStats, Error>>;
  getContributionStreak(username: string): Promise<Result<StreakInfo, Error>>;
  getPinnedRepos(username: string, limit: number): Promise<Result<FeaturedRepo[], Error>>;
}
