import { describe, expect, it, vi } from "vitest";
import type { Ports } from "../../../adapters";
import { createGenerateShareCardUseCase } from "../../../application/use-cases/generate-share-card";

import { ok } from "../../../shared/result";
import { mockConfig } from "../../mocks/config";

const mockPorts: Ports = {
  github: {
    getUserInfo: vi.fn().mockResolvedValue(
      ok({
        name: "Test",
        username: "test",
        bio: "",
        avatarUrl: "",
        location: "",
        company: "",
      }),
    ),
    getRecentCommits: vi.fn().mockResolvedValue(ok([])),
    getContributionStreak: vi.fn().mockResolvedValue(
      ok({
        currentStreak: 0,
        longestStreak: 0,
        lastContributionDate: new Date(),
        isActive: false,
      }),
    ),
    getLanguageStats: vi.fn().mockResolvedValue(ok([])),
    getContributionStats: vi.fn().mockResolvedValue(ok({ totalContributions: 0 })),
  },
  clock: {
    getTimeOfDay: vi.fn().mockReturnValue("day"),
    formatTime: vi.fn().mockReturnValue("12:00"),
    getCurrentTime: vi.fn().mockReturnValue(new Date()),
  },
  fileSystem: {
    readFile: vi.fn(),
    exists: vi.fn(),
    writeFile: vi.fn(),
  },
};

describe("GenerateShareCardUseCase", () => {
  it("should return state with 1200x630 dimensions and animations disabled", async () => {
    const useCase = createGenerateShareCardUseCase(mockPorts);
    const result = await useCase(mockConfig);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dimensions).toEqual({ width: 1200, height: 630 });
      expect(result.value.renderOptions?.disableAnimations).toBe(true);
    }
  });
});
