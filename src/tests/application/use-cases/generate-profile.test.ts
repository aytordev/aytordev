import { describe, expect, it } from "vitest";
import { createGenerateProfileUseCase } from "../../../application/use-cases/generate-profile";
import { portsBuilder } from "../../__support__/builders";
import { mockConfig } from "../../mocks/config";

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
          emoji: "\u{2728}",
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
      .withGitHubPinnedRepos([
        {
          name: "my-repo",
          nameWithOwner: "testuser/my-repo",
          description: "A cool repo",
          stargazerCount: 42,
          primaryLanguage: { name: "TypeScript", color: "#3178C6" },
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ])
      .build();

    const useCase = createGenerateProfileUseCase(ports);
    const result = await useCase(mockConfig);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.owner.username).toBe(mockConfig.owner.username);
      expect(result.value.themeName).toBe(mockConfig.theme);
      expect(result.value.timeOfDay).toBe("afternoon");
      expect(result.value.content.neofetchData.stats.totalCommits).toBeGreaterThanOrEqual(0);
      expect(result.value.content.neofetchData.stats.currentStreak).toBe(5);
      expect(result.value.content.featuredRepos).toHaveLength(1);
      expect(result.value.content.journey).toHaveLength(2);
      expect(result.value.content.contactCta).toBe("Let's connect! \u{1F4AC}");
    }
  });

  it("should return error if a port fails", async () => {
    const ports = portsBuilder().withGitHubError("getUserInfo", new Error("GitHub Error")).build();

    const useCase = createGenerateProfileUseCase(ports);
    const result = await useCase(mockConfig);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("GitHub Error");
    }
  });

  it("should populate neofetchData stats from API results", async () => {
    const ports = portsBuilder()
      .withGitHubUserInfo({
        name: "Test User",
        username: "testuser",
        bio: "Test Bio",
        avatarUrl: "http://avatar.url",
        location: "Test Location",
        company: "Test Company",
      })
      .withGitHubCommits([])
      .withGitHubStreak({
        currentStreak: 42,
        longestStreak: 100,
        lastContributionDate: new Date(),
        isActive: true,
      })
      .withGitHubLanguageStats([])
      .withGitHubPinnedRepos([])
      .build();

    const useCase = createGenerateProfileUseCase(ports);
    const result = await useCase(mockConfig);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.content.neofetchData.stats.currentStreak).toBe(42);
      expect(result.value.content.neofetchData.stats.totalCommits).toBe(500);
    }
  });
});
