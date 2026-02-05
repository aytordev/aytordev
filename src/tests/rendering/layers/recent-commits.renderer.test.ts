import { describe, expect, it } from "vitest";
import type { Commit } from "../../../domain/value-objects/commit";
import { renderRecentCommits } from "../../../rendering/layers/recent-commits.renderer";
import { KanagawaTheme } from "../../../theme/kanagawa";

describe("Recent Commits Renderer", () => {
  const commits: Commit[] = [
    {
      hash: "abc1234",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    },
    {
      hash: "def5678",
      message: "fix: resolve bug",
      emoji: "🐛",
      type: "fix",
      relativeTime: "1 day ago",
    },
  ];

  it("should render commit messages", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme);
    expect(svg).toContain("feat: initial commit");
    expect(svg).toContain("fix: resolve bug");
    expect(svg).toContain('class="commit__msg"');
  });

  it("should render commit times", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme);
    expect(svg).toContain("2 hours ago");
    expect(svg).toContain('class="commit__time"');
  });

  it("should apply correct type classes", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme);
    expect(svg).toContain('class="commit__type--feat"');
    expect(svg).toContain('class="commit__type--fix"');
  });

  it("should render title", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme);
    expect(svg).toContain("Recent Commits");
  });
});
