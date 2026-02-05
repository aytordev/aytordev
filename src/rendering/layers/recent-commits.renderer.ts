import type { Commit } from "../../domain/value-objects/commit";
import { sanitizeForSvg } from "../../shared/sanitize";
import type { Theme } from "../../theme/types";

export const renderRecentCommits = (
  commits: readonly Commit[],
  theme: Theme,
  x: number = 0,
  y: number = 0,
): string => {
  const titleHeight = 24;
  const itemHeight = 20;
  let currentY = 0;

  // Title
  let elements = `
    <text x="0" y="${currentY}" class="stack__title" fill="${theme.colors.roninYellow}" font-family="monospace" font-size="14" font-weight="bold">
      Recent Commits
    </text>
  `;
  currentY += titleHeight;

  // Commits
  const commitList = commits
    .map((commit, i) => {
      const cy = currentY + i * itemHeight;
      // Bullet point color based on type
      let bulletColor = theme.colors.text;
      if (commit.type === "feat") bulletColor = theme.colors.springGreen;
      if (commit.type === "fix") bulletColor = theme.colors.samuraiRed;
      if (commit.type === "docs") bulletColor = theme.colors.crystalBlue;

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
    })
    .join("");

  elements += commitList;

  return `
    <g id="recent-commits" transform="translate(${x}, ${y})">
      ${elements}
    </g>
  `.trim();
};
