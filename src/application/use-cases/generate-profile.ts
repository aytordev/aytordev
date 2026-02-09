import type { Ports } from "../../adapters";
import type { Config } from "../../config/schema";
import type { TerminalState } from "../../domain/entities/terminal-state";
import { getEasterEgg } from "../../domain/services/easter-egg.service";
import type { GenerateProfileUseCase } from "../../domain/use-cases/generate-profile";
import { err, ok, type Result } from "../../shared/result";

export const createGenerateProfileUseCase = (ports: Ports): GenerateProfileUseCase => {
  return async (config: Config): Promise<Result<TerminalState, Error>> => {
    try {
      const maxCommits = 5;

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

      const tmuxSessionName = config.tmux?.session_name ?? "dev";
      const tmuxWindows = config.tmux?.windows ?? ["zsh", "nvim"];

      const state: TerminalState = {
        themeName: config.theme,
        dimensions: config.dimensions ?? { width: 800, height: 400 },
        timestamp: ports.clock.getCurrentTime(config.owner.timezone),
        timeOfDay: ports.clock.getTimeOfDay(config.owner.timezone),
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
          gitStats: { added: 0, deleted: 0, modified: 0 },
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
              config.tech_stack?.categories?.map((c) => ({
                name: c.name,
                items: [...c.items],
              })) ?? [],
          },
          recentCommits: commits.value,
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
            config.contact?.items?.map((i) => ({
              label: i.label,
              value: i.value,
              icon: i.icon,
            })) ?? [],
          extraLines: [],
          dailyQuote: null,
          learningJourney: null,
          todayFocus: null,
        },
        animation: config.animation,
      };

      return ok(state);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };
};
