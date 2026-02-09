import type { Commit } from "../../../domain/value-objects/commit";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

const ITEM_HEIGHT = 20;

const getHashColor = (type: string, theme: Theme): string => {
  if (type === "feat") return theme.colors.springGreen;
  if (type === "fix") return theme.colors.samuraiRed;
  if (type === "docs") return theme.colors.crystalBlue;
  return theme.colors.carpYellow;
};

export const renderRecentCommits = (
  commits: readonly Commit[],
  theme: Theme,
  x: number = 0,
  y: number = 0,
): string => {
  const commitList = commits
    .map((commit, i) => {
      const cy = i * ITEM_HEIGHT;
      const hashColor = getHashColor(commit.type, theme);

      return (
        `<g transform="translate(0, ${cy})">` +
        `<text x="0" y="0" font-family="monospace" font-size="12">` +
        `<tspan fill="${hashColor}">${sanitizeForSvg(commit.hash)}</tspan>` +
        `<tspan fill="${theme.colors.text}"> ${sanitizeForSvg(commit.message)}</tspan>` +
        `<tspan fill="${theme.colors.textMuted}"> (${sanitizeForSvg(commit.relativeTime)})</tspan>` +
        `</text>` +
        `</g>`
      );
    })
    .join("\n");

  return `<g id="recent-commits" transform="translate(${x}, ${y})">` + commitList + `</g>`;
};
