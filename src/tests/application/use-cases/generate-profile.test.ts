import { describe, expect, it, vi } from "vitest";
import type { Ports } from "../../../adapters";
import { createGenerateProfileUseCase } from "../../../application/use-cases/generate-profile";
import { err, ok } from "../../../shared/result";
import { mockConfig } from "../../mocks/config";

// Mock Ports
const mockPorts: Ports = {
  github: {
    getUserInfo: vi.fn(),
    getRecentCommits: vi.fn(),
    getContributionStreak: vi.fn(),
    getLanguageStats: vi.fn(),
  },
  clock: {
    getTimeOfDay: vi.fn().mockReturnValue("afternoon"),
    formatTime: vi.fn().mockReturnValue("14:00"),
  },
  fileSystem: {
    readFile: vi.fn(),
    exists: vi.fn(),
    writeFile: vi.fn(),
  },
};

describe("GenerateProfileUseCase", () => {
  it("should generate a valid TerminalState when all ports return success", async () => {
    vi.mocked(mockPorts.github.getUserInfo).mockResolvedValue(
      ok({
        name: "Test User",
        username: "testuser",
        bio: "Test Bio",
        avatarUrl: "http://avatar.url",
        location: "Test Location",
        company: "Test Company",
      } as any),
    );
    vi.mocked(mockPorts.github.getRecentCommits).mockResolvedValue(
      ok([
        {
          message: "feat: test commit",
          date: new Date(),
          repo: "test-repo",
          sha: "abc1234",
        },
      ]),
    );
    vi.mocked(mockPorts.github.getContributionStreak).mockResolvedValue(
      ok({
        currentStreak: 5,
        longestStreak: 10,
        totalContributions: 100,
        todayContributions: 2,
        start: new Date(),
        end: new Date(),
      }),
    );
    vi.mocked(mockPorts.github.getLanguageStats).mockResolvedValue(ok([]));

    const useCase = createGenerateProfileUseCase(mockPorts);
    const result = await useCase(mockConfig);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.owner.username).toBe(mockConfig.owner.username);
      expect(result.value.themeName).toBe(mockConfig.theme);
      expect(result.value.timeOfDay).toBe("afternoon");
      expect(result.value.greeting).toContain("Good afternoon");
    }
  });

  it("should return error if a port fails", async () => {
    vi.mocked(mockPorts.github.getUserInfo).mockResolvedValue(
      err(new Error("GitHub Error")),
    );

    // We need to mock others too because Promise.all might run them
    vi.mocked(mockPorts.github.getRecentCommits).mockResolvedValue(ok([]));
    vi.mocked(mockPorts.github.getContributionStreak).mockResolvedValue(
      ok({} as any),
    );
    vi.mocked(mockPorts.github.getLanguageStats).mockResolvedValue(ok([]));

    const useCase = createGenerateProfileUseCase(mockPorts);
    const result = await useCase(mockConfig);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("GitHub Error");
    }
  });
});
