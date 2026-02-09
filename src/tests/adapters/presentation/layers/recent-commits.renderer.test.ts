import { describe, expect, it } from "vitest";
import { renderRecentCommits } from "../../../../adapters/presentation/layers/recent-commits.renderer";
import type { Commit } from "../../../../domain/value-objects/commit";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Recent Commits Renderer", () => {
  const commits: Commit[] = [
    {
      hash: "abc1234",
      message: "feat: initial commit",
      emoji: "\u{1F389}",
      type: "feat",
      relativeTime: "2 hours ago",
    },
    {
      hash: "def5678",
      message: "fix: resolve bug",
      emoji: "\u{1F41B}",
      type: "fix",
      relativeTime: "1 day ago",
    },
  ];

  it("should render commit hashes in git log --oneline style", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme);
    expect(svg).toContain("abc1234");
    expect(svg).toContain("def5678");
  });

  it("should render commit messages", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme);
    expect(svg).toContain("feat: initial commit");
    expect(svg).toContain("fix: resolve bug");
  });

  it("should render relative times", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme);
    expect(svg).toContain("2 hours ago");
    expect(svg).toContain("1 day ago");
  });

  it("should use dynamic coordinates", () => {
    const svg = renderRecentCommits(commits, KanagawaTheme, 100, 200);
    expect(svg).toContain('transform="translate(100, 200)"');
  });

  it("should be a pure function", () => {
    const svg1 = renderRecentCommits(commits, KanagawaTheme);
    const svg2 = renderRecentCommits(commits, KanagawaTheme);
    expect(svg1).toBe(svg2);
  });
});
