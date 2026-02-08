import { describe, expect, it, vi } from "vitest";
import type { Owner } from "../../config/schema";
import type { ClockPort } from "../../domain/ports/clock.port";
import type { EnvironmentPort } from "../../domain/ports/environment.port";
import type { FileSystemPort } from "../../domain/ports/file-system.port";
import type { ContributionStats, GitHubDataPort } from "../../domain/ports/github-data.port";
import type { LoggerPort } from "../../domain/ports/logger.port";
import type { ProcessPort } from "../../domain/ports/process.port";
import { ok } from "../../shared/result";

describe("Domain Ports", () => {
  it("should define GitHubDataPort interface correctly", async () => {
    // Mock implementation to verify interface contract
    const mockGitHub: GitHubDataPort = {
      getUserInfo: vi.fn().mockResolvedValue(ok({ name: "Test" } as Owner)),
      getRecentCommits: vi.fn().mockResolvedValue(ok([])),
      getLanguageStats: vi.fn().mockResolvedValue(ok([])),
      getContributionStats: vi
        .fn()
        .mockResolvedValue(ok({ totalContributions: 100 } as ContributionStats)),
      getContributionStreak: vi.fn().mockResolvedValue(
        ok({
          currentStreak: 5,
          isActive: true,
          longestStreak: 10,
          lastContributionDate: new Date(),
        }),
      ),
    };

    const result = await mockGitHub.getContributionStats("user");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalContributions).toBe(100);
    }
  });

  it("should define ClockPort interface correctly", () => {
    const mockClock: ClockPort = {
      getCurrentTime: vi.fn().mockReturnValue(new Date()),
      getTimeOfDay: vi.fn().mockReturnValue("morning"),
      formatTime: vi.fn().mockReturnValue("12:00"),
    };

    expect(mockClock.getTimeOfDay("UTC")).toBe("morning");
  });

  it("should define FileSystemPort interface correctly", async () => {
    const mockFs: FileSystemPort = {
      exists: vi.fn().mockResolvedValue(true),
      readFile: vi.fn().mockResolvedValue("content"),
    };

    expect(await mockFs.exists("file.txt")).toBe(true);
  });

  it("should define LoggerPort interface correctly", () => {
    const mockLogger: LoggerPort = {
      log: vi.fn(),
      error: vi.fn(),
    };

    mockLogger.log("test message");
    expect(mockLogger.log).toHaveBeenCalledWith("test message");

    mockLogger.error("error message");
    expect(mockLogger.error).toHaveBeenCalledWith("error message");
  });

  it("should define EnvironmentPort interface correctly", () => {
    const mockEnv: EnvironmentPort = {
      get: vi.fn().mockReturnValue("test-value"),
      cwd: vi.fn().mockReturnValue("/test/path"),
    };

    expect(mockEnv.get("TEST_KEY")).toBe("test-value");
    expect(mockEnv.cwd()).toBe("/test/path");
  });

  it("should define ProcessPort interface correctly", () => {
    const exitMock = vi.fn();
    const mockProcess: ProcessPort = {
      exit: exitMock,
      argv: Object.freeze(["node", "script.js", "--flag"]),
    };

    expect(mockProcess.argv).toEqual(["node", "script.js", "--flag"]);
    expect(mockProcess.argv).toBe(mockProcess.argv); // Should be immutable reference

    mockProcess.exit(0);
    expect(exitMock).toHaveBeenCalledWith(0);
  });
});
