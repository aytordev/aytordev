import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import type { Owner } from "../config/schema";
import type {
  ContributionStats,
  GitHubDataPort,
} from "../domain/ports/github-data.port";
import type { Commit, CommitType } from "../domain/value-objects/commit";
import type { LanguageStat } from "../domain/value-objects/language-stat";
import type { StreakInfo } from "../domain/value-objects/streak-info";
import { type Result, err, ok } from "../shared/result";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: ContributionWeek[];
      };
    };
  };
}

interface PushEventPayload {
  commits?: Array<{
    sha: string;
    message: string;
  }>;
}

interface GitHubEvent {
  type: string;
  created_at?: string;
  payload: PushEventPayload;
}

function parseCommitType(message: string): CommitType {
  const match = message.match(/^(feat|fix|docs|style|refactor|test|chore)/i);
  if (match) {
    return match[1].toLowerCase() as CommitType;
  }
  return "chore";
}

function parseCommitEmoji(message: string): string {
  const emojiMatch = message.match(
    /^(:\w+:|[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}])/u,
  );
  if (emojiMatch) return emojiMatch[1];

  const type = parseCommitType(message);
  const emojiMap: Record<CommitType, string> = {
    feat: "✨",
    fix: "🐛",
    docs: "📝",
    style: "💄",
    refactor: "♻️",
    test: "✅",
    chore: "🔧",
  };
  return emojiMap[type];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

function calculateStreak(days: ContributionDay[]): StreakInfo {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let isActive = false;

  // Sort by date descending (most recent first)
  const sortedDays = [...days].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Check if today or yesterday has contributions (active streak)
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  for (let i = 0; i < sortedDays.length; i++) {
    const day = sortedDays[i];
    if (day.contributionCount > 0) {
      tempStreak++;
      if (i === 0 && (day.date === today || day.date === yesterday)) {
        isActive = true;
      }
    } else {
      if (tempStreak > 0) {
        if (currentStreak === 0) currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
  }

  // Handle case where streak continues to end
  if (tempStreak > 0) {
    if (currentStreak === 0) currentStreak = tempStreak;
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return {
    currentStreak: isActive ? currentStreak : 0,
    longestStreak,
    lastContributionDate: new Date(sortedDays[0]?.date ?? Date.now()),
    isActive,
  };
}

export class GitHubApiAdapter implements GitHubDataPort {
  private readonly octokit: Octokit;
  private readonly graphqlClient: typeof graphql;

  constructor(token?: string) {
    this.octokit = new Octokit({ auth: token });
    this.graphqlClient = graphql.defaults({
      headers: { authorization: token ? `token ${token}` : "" },
    });
  }

  async getUserInfo(username: string): Promise<Result<Owner, Error>> {
    try {
      const { data } = await this.octokit.users.getByUsername({ username });
      return ok({
        name: data.name ?? username,
        username: data.login,
        title: data.bio ?? "Developer",
        location: data.location ?? "Earth",
        timezone: "UTC", // GitHub API doesn't expose timezone
      });
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getRecentCommits(
    username: string,
    limit: number,
  ): Promise<Result<Commit[], Error>> {
    try {
      const { data: events } =
        await this.octokit.activity.listPublicEventsForUser({
          username,
          per_page: limit * 5, // Fetch more to filter PushEvents
        });

      const commits: Commit[] = [];

      for (const event of events as GitHubEvent[]) {
        if (event.type === "PushEvent" && event.payload.commits) {
          for (const commit of event.payload.commits) {
            commits.push({
              hash: commit.sha.substring(0, 7),
              message: commit.message.split("\n")[0].substring(0, 50),
              emoji: parseCommitEmoji(commit.message),
              type: parseCommitType(commit.message),
              relativeTime: formatRelativeTime(
                new Date(event.created_at ?? Date.now()),
              ),
            });
            if (commits.length >= limit) break;
          }
        }
        if (commits.length >= limit) break;
      }

      return ok(commits);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getLanguageStats(
    username: string,
  ): Promise<Result<LanguageStat[], Error>> {
    try {
      const { data: repos } = await this.octokit.repos.listForUser({
        username,
        per_page: 100,
        sort: "updated",
      });

      const languageBytes: Record<string, number> = {};

      // Aggregate language bytes from top repos
      for (const repo of repos.slice(0, 20)) {
        if (repo.fork) continue;
        try {
          const { data: languages } = await this.octokit.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });
          for (const [lang, bytes] of Object.entries(languages)) {
            languageBytes[lang] = (languageBytes[lang] ?? 0) + bytes;
          }
        } catch {
          // Skip repos we can't access
        }
      }

      const total = Object.values(languageBytes).reduce((a, b) => a + b, 0);
      const stats: LanguageStat[] = Object.entries(languageBytes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / total) * 100),
          bytes,
          color: getLanguageColor(name),
        }));

      return ok(stats);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getContributionStats(
    username: string,
  ): Promise<Result<ContributionStats, Error>> {
    try {
      const { user } = await this.graphqlClient<ContributionResponse>(
        `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `,
        { username },
      );

      const days =
        user.contributionsCollection.contributionCalendar.weeks.flatMap(
          (w) => w.contributionDays,
        );

      const totalContributions = days.reduce(
        (sum, day) => sum + day.contributionCount,
        0,
      );

      return ok({ totalContributions });
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getContributionStreak(
    username: string,
  ): Promise<Result<StreakInfo, Error>> {
    try {
      const { user } = await this.graphqlClient<ContributionResponse>(
        `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `,
        { username },
      );

      const days =
        user.contributionsCollection.contributionCalendar.weeks.flatMap(
          (w) => w.contributionDays,
        );

      return ok(calculateStreak(days));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

// GitHub language colors (subset)
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    Python: "#3776AB",
    Rust: "#DEA584",
    Go: "#00ADD8",
    Java: "#B07219",
    "C++": "#F34B7D",
    C: "#555555",
    Ruby: "#CC342D",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Nix: "#7E7EFF",
    Shell: "#89E051",
    HTML: "#E34F26",
    CSS: "#1572B6",
    SCSS: "#C6538C",
    Vue: "#42B883",
    Svelte: "#FF3E00",
  };
  return colors[language] ?? "#8B8B8B";
}
