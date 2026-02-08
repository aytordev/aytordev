/**
 * Builder for Ports mock objects with sensible defaults
 * All ports are configured with vi.fn() mocks and default return values
 *
 * @example
 * ```typescript
 * const ports = portsBuilder()
 *   .withGitHubUserInfo({ name: "Custom User" })
 *   .build();
 * ```
 */

import { type Mock, vi } from "vitest";
import type { Ports } from "../../../adapters";
import { ok, err } from "../../../shared/result";
import type { Result } from "../../../shared/result";

export class PortsBuilder {
  private ports: Ports;

  constructor() {
    // Initialize all ports with default mocks
    this.ports = {
      github: {
        getUserInfo: vi.fn().mockResolvedValue(
          ok({
            name: "Test User",
            username: "testuser",
            bio: "Test Bio",
            avatarUrl: "https://example.com/avatar.png",
            location: "Test Location",
            company: null,
            websiteUrl: null,
          }),
        ),
        getRecentCommits: vi.fn().mockResolvedValue(ok([])),
        getContributionStreak: vi.fn().mockResolvedValue(
          ok({
            currentStreak: 5,
            longestStreak: 10,
            lastContributionDate: new Date(),
            isActive: true,
          }),
        ),
        getLanguageStats: vi.fn().mockResolvedValue(ok([])),
        getContributionStats: vi.fn().mockResolvedValue(
          ok({
            totalContributions: 500,
          }),
        ),
      },
      clock: {
        getTimeOfDay: vi.fn().mockReturnValue("afternoon"),
        formatTime: vi.fn().mockReturnValue("14:00"),
        getCurrentTime: vi.fn().mockReturnValue(new Date()),
      },
      fileSystem: {
        readFile: vi.fn(),
        exists: vi.fn(),
        writeFile: vi.fn(),
      },
      environment: {
        nodeVersion: vi.fn().mockReturnValue("v24.0.0"),
        get: vi.fn().mockReturnValue(undefined),
        cwd: vi.fn().mockReturnValue("/test/dir"),
      },
      logger: {
        log: vi.fn(),
        error: vi.fn(),
      },
      process: {
        exit: vi.fn(),
        argv: [],
      },
    };
  }

  /**
   * Configure GitHub getUserInfo mock
   */
  withGitHubUserInfo(data: any): this {
    (this.ports.github.getUserInfo as Mock).mockResolvedValue(ok(data));
    return this;
  }

  /**
   * Configure GitHub getRecentCommits mock
   */
  withGitHubCommits(commits: any[]): this {
    (this.ports.github.getRecentCommits as Mock).mockResolvedValue(ok(commits));
    return this;
  }

  /**
   * Configure GitHub getContributionStreak mock
   */
  withGitHubStreak(streak: any): this {
    (this.ports.github.getContributionStreak as Mock).mockResolvedValue(ok(streak));
    return this;
  }

  /**
   * Configure GitHub getLanguageStats mock
   */
  withGitHubLanguageStats(stats: any[]): this {
    (this.ports.github.getLanguageStats as Mock).mockResolvedValue(ok(stats));
    return this;
  }

  /**
   * Configure GitHub error for a specific method
   */
  withGitHubError(method: keyof typeof this.ports.github, error: Error): this {
    (this.ports.github[method] as Mock).mockResolvedValue(err(error));
    return this;
  }

  /**
   * Configure clock getTimeOfDay mock
   */
  withTimeOfDay(timeOfDay: string): this {
    (this.ports.clock.getTimeOfDay as Mock).mockReturnValue(timeOfDay);
    return this;
  }

  /**
   * Configure clock formatTime mock
   */
  withFormattedTime(time: string): this {
    (this.ports.clock.formatTime as Mock).mockReturnValue(time);
    return this;
  }

  /**
   * Build the final Ports mock
   */
  build(): Ports {
    return this.ports;
  }
}

/**
 * Factory function for creating a PortsBuilder
 */
export const portsBuilder = (): PortsBuilder => new PortsBuilder();
