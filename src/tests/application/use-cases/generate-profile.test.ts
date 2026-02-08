import { describe, expect, it } from "vitest";
import { createGenerateProfileUseCase } from "../../../application/use-cases/generate-profile";
import { mockConfig } from "../../mocks/config";
import { portsBuilder } from "../../__support__/builders";

describe("GenerateProfileUseCase", () => {
  it("should generate a valid TerminalState when all ports return success", async () => {
    const ports = portsBuilder()
      .withGitHubUserInfo({
        name: "Test User",
        username: "testuser",
        bio: "Test Bio",
        avatarUrl: "http://avatar.url",
        location: "Test Location",
        company: "Test Company",
      })
      .withGitHubCommits([
        {
          message: "feat: test commit",
          emoji: "✨",
          type: "feat",
          hash: "abc1234",
          relativeTime: "2 hours ago",
        },
      ])
      .withGitHubStreak({
        currentStreak: 5,
        longestStreak: 10,
        lastContributionDate: new Date(),
        isActive: true,
      })
      .withGitHubLanguageStats([])
      .build();

    const useCase = createGenerateProfileUseCase(ports);
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
    const ports = portsBuilder()
      .withGitHubError("getUserInfo", new Error("GitHub Error"))
      .build();

    const useCase = createGenerateProfileUseCase(ports);
    const result = await useCase(mockConfig);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("GitHub Error");
    }
  });
});
