import { describe, expect, it, vi } from "vitest";
import type { Ports } from "../../../adapters";
import { GenerateProfileUseCase } from "../../../application/use-cases/generate-profile";
import { err, ok } from "../../../shared/result";
import { mockConfig } from "../../mocks/config";

// Mock Ports
const mockPorts: Ports = {
  github: {
    getUserInfo: vi.fn(),
    getRecentCommits: vi.fn(),
    getLanguageStats: vi.fn(),
    getContributionStreak: vi.fn(),
    getContributionStats: vi.fn(),
  },
  clock: {
    getCurrentTime: vi.fn().mockReturnValue(new Date("2023-01-01T12:00:00Z")),
    getTimeOfDay: vi.fn().mockReturnValue("afternoon"),
    formatTime: vi.fn().mockReturnValue("12:00"),
  },
  fileSystem: {
    writeFile: vi.fn(),
    readFile: vi.fn(),
    exists: vi.fn().mockResolvedValue(true),
  },
};

describe("GenerateProfileUseCase", () => {
  it("should generate a valid TerminalState when all ports return success", async () => {
    // Setup Mocks
    vi.mocked(mockPorts.github.getUserInfo).mockResolvedValue(
      ok(mockConfig.owner),
    );
    vi.mocked(mockPorts.github.getRecentCommits).mockResolvedValue(ok([]));
    vi.mocked(mockPorts.github.getContributionStreak).mockResolvedValue(
      ok({
        currentStreak: 5,
        longestStreak: 10,
        lastContributionDate: new Date(),
        isActive: true,
      }),
    );
    vi.mocked(mockPorts.github.getLanguageStats).mockResolvedValue(ok([]));

    const useCase = new GenerateProfileUseCase(mockPorts);
    const result = await useCase.execute(mockConfig);

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

    const useCase = new GenerateProfileUseCase(mockPorts);
    const result = await useCase.execute(mockConfig);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("GitHub Error");
    }
  });
});
