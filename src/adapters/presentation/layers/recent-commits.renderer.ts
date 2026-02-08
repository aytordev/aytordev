import type { Commit } from "../../../domain/value-objects/commit";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

export const renderRecentCommits = (
  commits: readonly Commit[],
  theme: Theme,
  x: number = 0,
  y: number = 0,
): string => {
  const titleHeight = 24;
  const itemHeight = 20;

  // Pure function to determine bullet color
  const getBulletColor = (type: string): string => {
    if (type === "feat") return theme.colors.springGreen;
    if (type === "fix") return theme.colors.samuraiRed;
    if (type === "docs") return theme.colors.crystalBlue;
    return theme.colors.text;
  };

  // Title
  const titleSvg = `
    <text x="0" y="0" class="stack__title" fill="${theme.colors.roninYellow}" font-family="monospace" font-size="14" font-weight="bold">
      Recent Commits
    </text>
  `;

  // Commits - immutable transformation
  const commitsY = titleHeight;
  const commitList = commits.map((commit, i) => {
    const cy = commitsY + i * itemHeight;
    const bulletColor = getBulletColor(commit.type);

    return `
      <g class="commit">
        <circle cx="5" cy="${cy - 4}" r="3" class="commit__type--${commit.type}" fill="${bulletColor}" />
        <text x="15" y="${cy}" class="commit__msg" fill="${theme.colors.text}" font-family="monospace" font-size="12">
          ${sanitizeForSvg(commit.message)}
        </text>
        <text x="300" y="${cy}" class="commit__time" fill="${theme.colors.textMuted}" font-family="monospace" font-size="12" text-anchor="end">
          (${sanitizeForSvg(commit.relativeTime)})
        </text>
      </g>
    `;
  });

  const elements = [titleSvg, ...commitList].join("\n");

  return `
    <g id="recent-commits" transform="translate(${x}, ${y})">
      ${elements}
    </g>
  `.trim();
};
