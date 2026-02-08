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

  it("should support TimeOfDay type", () => {
    // Compile-time check mainly, but useful for documentation
    const time: import("../../domain/value-objects/time-of-day").TimeOfDay = "morning";
    expect(time).toBe("morning");
  });

  it("should support CareerMilestone structure", () => {
    const milestone: import("../../domain/value-objects/career-milestone").CareerMilestone = {
      year: 2024,
      title: "Senior Engineer",
      company: "Tech Corp",
    };
    expect(milestone.year).toBe(2024);
  });

  it("should support ContactItem structure", () => {
    const contact: import("../../domain/value-objects/contact-item").ContactItem = {
      label: "Email",
      value: "test@example.com",
      icon: "📧",
    };
    expect(contact.icon).toBe("📧");
  });

  it("should support ExtraLine type", () => {
    const line: import("../../domain/value-objects/extra-line").ExtraLine = "Custom text line";
    expect(line).toContain("Custom");
  });

  it("should support LanguageStat structure", () => {
    const stat: import("../../domain/value-objects/language-stat").LanguageStat = {
      name: "TypeScript",
      percentage: 85.5,
      bytes: 10240,
      color: "#3178C6",
    };
    expect(stat.percentage).toBeGreaterThan(0);
  });
});
