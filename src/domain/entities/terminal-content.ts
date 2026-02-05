import type { CareerMilestone } from "../value-objects/career-milestone";
import type { Commit } from "../value-objects/commit";
import type { ContactItem } from "../value-objects/contact-item";
import type { ExtraLine } from "../value-objects/extra-line";
import type { LanguageStat } from "../value-objects/language-stat";
import type { StreakInfo } from "../value-objects/streak-info";
import type { TechStack } from "../value-objects/tech-stack";

export interface DeveloperInfo {
  readonly name: string;
  readonly username: string;
  readonly tagline: string;
  readonly location: string;
}

export interface LearningItem {
  readonly current: string;
}

export interface GitHubStats {
  readonly publicRepos: number;
  readonly followers: number;
  readonly following: number;
  readonly totalStars: number;
}

export interface TerminalContent {
  readonly developerInfo: DeveloperInfo;
  readonly techStack: TechStack;
  readonly languageStats: readonly LanguageStat[];
  readonly recentCommits: readonly Commit[];
  readonly stats: GitHubStats;
  readonly streak: StreakInfo;
  readonly learningJourney: LearningItem | null;
  readonly todayFocus: string | null;
  readonly dailyQuote: string | null;
  readonly careerTimeline: readonly CareerMilestone[];
  readonly contactInfo: readonly ContactItem[];
  readonly extraLines: readonly ExtraLine[];
  readonly asciiArt?: string;
}
