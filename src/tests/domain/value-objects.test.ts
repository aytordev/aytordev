import { describe, expect, it } from "vitest";
import type { Commit } from "../../domain/value-objects/commit";
import type { StreakInfo } from "../../domain/value-objects/streak-info";
import type { TechStack } from "../../domain/value-objects/tech-stack";

describe("Domain Value Objects", () => {
  it("should support Commit structure", () => {
    const commit: Commit = {
      hash: "abc1234",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    };
    expect(commit.hash).toBe("abc1234");
  });

  it("should support StreakInfo structure", () => {
    const streak: StreakInfo = {
      currentStreak: 5,
      longestStreak: 10,
      lastContributionDate: new Date(),
      isActive: true,
    };
    expect(streak.currentStreak).toBe(5);
  });

  it("should support TechStack structure", () => {
    const stack: TechStack = {
      categories: [
        {
          name: "Languages",
          items: ["TypeScript"],
        },
      ],
    };
    expect(stack.categories[0].name).toBe("Languages");
  });
});
