import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import type { ContributionStats, GitHubDataPort } from "../../domain/ports/github-data.port";
import { parseCommitEmoji, parseCommitType } from "../../domain/services/commit-parser";
import { calculateStreak } from "../../domain/services/streak-calculator";
import type { Commit } from "../../domain/value-objects/commit";
import type { FeaturedRepo } from "../../domain/value-objects/featured-repo";
import type { LanguageStat } from "../../domain/value-objects/language-stat";
import type { Owner } from "../../domain/value-objects/owner";
import type { StreakInfo } from "../../domain/value-objects/streak-info";
import { err, ok, type Result } from "../../shared/result";
import { formatRelativeTime } from "../../shared/time-formatter";

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

interface PinnedRepoNode {
  name: string;
  nameWithOwner: string;
  description: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string } | null;
  updatedAt: string;
}

interface PinnedReposResponse {
  user: {
    pinnedItems: {
      nodes: PinnedRepoNode[];
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

export const createGitHubApiAdapter = (token: string): GitHubDataPort => {
  // Capture dependencies in closures
  const octokit = new Octokit({ auth: token });
  const graphqlClient = graphql.defaults({
    headers: { authorization: token ? `token ${token}` : "" },
  });

  // Return object with methods
  return {
    getUserInfo: async (username: string): Promise<Result<Owner, Error>> => {
      try {
        const { data } = await octokit.users.getByUsername({ username });
        return ok({
          name: data.name ?? username,
          username: data.login,
          title: data.bio ?? "Developer",
          location: data.location ?? "Earth",
          timezone: "UTC",
        });
      } catch (error) {
        return err(error instanceof Error ? error : new Error(String(error)));
      }
    },

    getRecentCommits: async (username: string, limit: number): Promise<Result<Commit[], Error>> => {
      try {
        const { data: events } = await octokit.activity.listPublicEventsForUser({
          username,
          per_page: limit * 5,
        });

        // Use reduce instead of for loop with mutations
        const commits = (events as GitHubEvent[]).reduce((acc, event) => {
          if (acc.length >= limit) return acc;
          if (event.type !== "PushEvent" || !event.payload.commits) return acc;

          const newCommits = event.payload.commits.map((commit) => ({
            hash: commit.sha.substring(0, 7),
            message: commit.message.split("\n")[0].substring(0, 50),
            emoji: parseCommitEmoji(commit.message),
            type: parseCommitType(commit.message),
            relativeTime: formatRelativeTime(new Date(event.created_at ?? Date.now())),
          }));

          return [...acc, ...newCommits].slice(0, limit);
        }, [] as Commit[]);

        return ok(commits);
      } catch (error) {
        return err(error instanceof Error ? error : new Error(String(error)));
      }
    },

    getLanguageStats: async (username: string): Promise<Result<LanguageStat[], Error>> => {
      try {
        const { data: repos } = await octokit.repos.listForUser({
          username,
          per_page: 100,
          sort: "updated",
        });

        const languageBytes: Record<string, number> = {};

        // Aggregate language bytes from top repos
        for (const repo of repos.slice(0, 20)) {
          if (repo.fork) continue;
          try {
            const { data: languages } = await octokit.repos.listLanguages({
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
    },

    getContributionStats: async (username: string): Promise<Result<ContributionStats, Error>> => {
      try {
        const { user } = await graphqlClient<ContributionResponse>(
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

        const days = user.contributionsCollection.contributionCalendar.weeks.flatMap(
          (w) => w.contributionDays,
        );

        const totalContributions = days.reduce((sum, day) => sum + day.contributionCount, 0);

        return ok({ totalContributions });
      } catch (error) {
        return err(error instanceof Error ? error : new Error(String(error)));
      }
    },

    getContributionStreak: async (username: string): Promise<Result<StreakInfo, Error>> => {
      try {
        const { user } = await graphqlClient<ContributionResponse>(
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

        const days = user.contributionsCollection.contributionCalendar.weeks.flatMap(
          (w) => w.contributionDays,
        );

        return ok(calculateStreak(days));
      } catch (error) {
        return err(error instanceof Error ? error : new Error(String(error)));
      }
    },

    getPinnedRepos: async (
      username: string,
      limit: number,
    ): Promise<Result<FeaturedRepo[], Error>> => {
      try {
        const { user } = await graphqlClient<PinnedReposResponse>(
          `
          query($username: String!, $limit: Int!) {
            user(login: $username) {
              pinnedItems(first: $limit, types: [REPOSITORY]) {
                nodes {
                  ... on Repository {
                    name
                    nameWithOwner
                    description
                    stargazerCount
                    primaryLanguage { name color }
                    updatedAt
                  }
                }
              }
            }
          }
        `,
          { username, limit },
        );

        const repos: FeaturedRepo[] = user.pinnedItems.nodes.map((node) => ({
          name: node.name,
          nameWithOwner: node.nameWithOwner,
          description: node.description ?? undefined,
          stargazerCount: node.stargazerCount,
          primaryLanguage: node.primaryLanguage ?? undefined,
          updatedAt: node.updatedAt,
        }));

        return ok(repos);
      } catch (error) {
        return err(error instanceof Error ? error : new Error(String(error)));
      }
    },
  };
};

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
