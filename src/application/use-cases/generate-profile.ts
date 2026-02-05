import type { Ports } from "../../adapters";
import type { Config } from "../../config/schema";
import type { TerminalState } from "../../domain/entities/terminal-state"; // Moved to domain, so peer
import { type Result, err, ok } from "../../shared/result";

export class GenerateProfileUseCase {
  constructor(private readonly ports: Ports) {}

  async execute(config: Config): Promise<Result<TerminalState, Error>> {
    try {
      // Parallel data fetching
      // Use defaults if config sections are optional (though Schema should enforce defaults, TS might be strict)
      const maxCommits = config.content?.commits?.max_count ?? 5;

      const [userInfo, commits, streak, languageStats] = await Promise.all([
        this.ports.github.getUserInfo(config.owner.username),
        this.ports.github.getRecentCommits(config.owner.username, maxCommits),
        this.ports.github.getContributionStreak(config.owner.username),
        this.ports.github.getLanguageStats(config.owner.username),
      ]);

      if (!userInfo.ok) return err(userInfo.error);
      if (!commits.ok) return err(commits.error);
      if (!streak.ok) return err(streak.error);
      if (!languageStats.ok) return err(languageStats.error);

      // Build State
      const tmuxSessionName = config.tmux?.session_name ?? "dev";
      const tmuxWindows = config.tmux?.windows ?? ["zsh", "nvim"];

      const state: TerminalState = {
        themeName: config.theme,
        dimensions: config.dimensions ?? { width: 800, height: 400 },
        timestamp: new Date(),
        timeOfDay: this.ports.clock.getTimeOfDay(config.owner.timezone),
        greeting: this.getGreeting(config.owner.name, config.owner.timezone),
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
          nodeVersion: process.version,
          nixIndicator: true,
          time: this.ports.clock.formatTime(new Date(), config.owner.timezone),
        },
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
          stats: {
            publicRepos: 10,
            followers: 50,
            following: 10,
            totalStars: 100,
          }, // Mock or needs extra fetch
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
          dailyQuote: config.content?.learning?.enabled
            ? "Keep building!"
            : null,
          learningJourney: config.content?.learning?.enabled
            ? { current: config.content.learning.current ?? "" }
            : null,
          todayFocus: config.content?.current_focus?.enabled
            ? (config.content.current_focus.text ?? null)
            : null,
          asciiArt: config.content?.ascii_art,
        },
      };

      return ok(state);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private getGreeting(name: string, timezone: string): string {
    const timeOfDay = this.ports.clock.getTimeOfDay(timezone);
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
  }
}
