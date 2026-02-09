import type { Commit } from "../value-objects/commit";
import type { ContactItem } from "../value-objects/contact-item";
import type { FeaturedRepo } from "../value-objects/featured-repo";
import type { JourneyEntry } from "../value-objects/journey-entry";
import type { LanguageStat } from "../value-objects/language-stat";
import type { SystemInfo } from "../value-objects/system-info";
import type { TechStack } from "../value-objects/tech-stack";

export interface DeveloperInfo {
  readonly name: string;
  readonly username: string;
  readonly tagline: string;
  readonly location: string;
}

export interface NeofetchStats {
  readonly totalCommits: number;
  readonly currentStreak: number;
  readonly publicRepos: number;
}

export interface NeofetchData {
  readonly owner: DeveloperInfo;
  readonly system: SystemInfo;
  readonly stats: NeofetchStats;
}

export interface TerminalContent {
  readonly neofetchData: NeofetchData;
  readonly journey: ReadonlyArray<JourneyEntry>;
  readonly techStack: TechStack;
  readonly languageStats: ReadonlyArray<LanguageStat>;
  readonly recentCommits: ReadonlyArray<Commit>;
  readonly featuredRepos: ReadonlyArray<FeaturedRepo>;
  readonly contactInfo: ReadonlyArray<ContactItem>;
  readonly contactCta: string;
}
