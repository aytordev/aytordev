import type { Ports } from "../../adapters";
import type { Config } from "../../config/schema";
import type { TerminalState } from "../../domain/entities/terminal-state";
import { getEasterEgg } from "../../domain/services/easter-egg.service";
import type { GenerateProfileUseCase } from "../../domain/use-cases/generate-profile";
import { err, ok, type Result } from "../../shared/result";

export const createGenerateProfileUseCase = (ports: Ports): GenerateProfileUseCase => {
  return async (config: Config): Promise<Result<TerminalState, Error>> => {
    try {
      const maxCommits = config.content?.commits?.max_count ?? 5;

      // Get Time
      const timestamp = ports.clock.getCurrentTime(config.owner.timezone);

      const [userInfo, commits, streak, languageStats] = await Promise.all([
        ports.github.getUserInfo(config.owner.username),
        ports.github.getRecentCommits(config.owner.username, maxCommits),
        ports.github.getContributionStreak(config.owner.username),
        ports.github.getLanguageStats(config.owner.username),
      ]);

      if (!userInfo.ok) return err(userInfo.error);
      if (!commits.ok) return err(commits.error);
      if (!streak.ok) return err(streak.error);
      if (!languageStats.ok) return err(languageStats.error);

      // Build State
      const tmuxSessionName = config.tmux?.session_name ?? "dev";
      const tmuxWindows = config.tmux?.windows ?? ["zsh", "nvim"];

      const getGreeting = (name: string, timezone: string): string => {
        const timeOfDay = ports.clock.getTimeOfDay(timezone);
        const firstName = name.split(" ")[0];
        switch (timeOfDay) {
          case "morning":
            return `Good morning, ${firstName}`;
          case "afternoon":
            return `Good afternoon, ${firstName}`;
          case "evening":
            return `Good evening, ${firstName}`;
          case "night":
            return `Working late, ${firstName}?`;
          default:
            return `Hello, ${firstName}`;
        }
      };

      const state: TerminalState = {
        themeName: config.theme,
        dimensions: config.dimensions ?? { width: 800, height: 400 },
        timestamp: ports.clock.getCurrentTime(config.owner.timezone),
        timeOfDay: ports.clock.getTimeOfDay(config.owner.timezone),
        greeting: getGreeting(config.owner.name, config.owner.timezone),
        owner: config.owner,
        session: {
          sessionName: tmuxSessionName,
          activeWindowIndex: 1,
          currentBranch: "main",
          windows: tmuxWindows.map((name, i) => ({
            index: i + 1,
            name,
          })) as any,
          stats: { cpuLoad: 12, memoryUsage: 40, uptime: "3d 4h" },
        },
        prompt: {
          directory: "~/github/profile",
          gitBranch: "main",
          gitStatus: "clean",
          // Note: Local git stats require filesystem access and are not available via GitHub API
          // These would need to be fetched separately if local repository access is available
          gitStats: {
            added: 0,
            deleted: 0,
            modified: 0,
          },

          nodeVersion: ports.environment.nodeVersion(),

          nixIndicator: true,
          time: ports.clock.formatTime(
            ports.clock.getCurrentTime(config.owner.timezone),
            config.owner.timezone,
          ),
        },
        easterEgg: getEasterEgg(timestamp) || undefined,
        content: {
          developerInfo: {
            name: config.owner.name,
            username: config.owner.username,
            tagline: config.owner.title,
            location: config.owner.location,
          },
          techStack: {
            categories:
              config.content?.tech_stack?.categories?.map((c) => ({
                name: c.name,
                items: c.items,
              })) ?? [],
          },
          recentCommits: commits.value,
          // Note: GitHub API v3 has rate limits; fetching detailed stats requires additional API calls
          // Consider implementing if needed, or leave as 0 for minimal API usage
          stats: {
            publicRepos: 0,
            followers: 0,
            following: 0,
            totalStars: 0,
          },
          streak: streak.value,
          languageStats: languageStats.value,
          careerTimeline: [],
          contactInfo:
            config.content?.contact?.items?.map((i) => ({
              label: i.label,
              value: i.value,
              icon: i.icon,
            })) ?? [],
          extraLines: config.content?.extra_lines ?? [],
          dailyQuote: config.content?.learning?.enabled ? "Keep building!" : null,
          learningJourney: config.content?.learning?.enabled
            ? { current: config.content.learning.current ?? "" }
            : null,
          todayFocus: config.content?.current_focus?.enabled
            ? (config.content.current_focus.text ?? null)
            : null,
          asciiArt: config.content?.ascii_art,
        },
        animation: config.animation,
      };

      return ok(state);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };
};
