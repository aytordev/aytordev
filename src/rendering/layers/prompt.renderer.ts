import type { StarshipPrompt } from "../../domain/entities/starship-prompt";
import type { Theme } from "../../theme/types";

export const renderPrompt = (
  prompt: StarshipPrompt,
  theme: Theme,
  y: number,
): string => {
  const fontSize = 14;
  const lineHeight = 20;

  // Line 1: Context info
  let line1X = 10;
  let line1Svg = "";

  // Directory
  const dirWidth = prompt.directory.length * 8.5; // Approx width
  line1Svg += `<text x="${line1X}" y="${y}" class="prompt__dir" fill="${theme.colors.crystalBlue}" font-family="monospace" font-size="${fontSize}" font-weight="bold">${prompt.directory}</text>`;
  line1X += dirWidth + 10;

  // Git
  if (prompt.gitBranch) {
    const gitText = `on  ${prompt.gitBranch} [${prompt.gitStatus || "?"}]`;
    const gitWidth = gitText.length * 8.5;
    line1Svg += `<text x="${line1X}" y="${y}" class="prompt__git" fill="${theme.colors.oniViolet}" font-family="monospace" font-size="${fontSize}">${gitText}</text>`;
    line1X += gitWidth + 10;
  }

  // Node
  if (prompt.nodeVersion) {
    const nodeText = `via ⬢ ${prompt.nodeVersion}`;
    const nodeWidth = nodeText.length * 8.5;
    line1Svg += `<text x="${line1X}" y="${y}" class="prompt__node" fill="${theme.colors.autumnGreen}" font-family="monospace" font-size="${fontSize}">${nodeText}</text>`;
    line1X += nodeWidth + 10;
  }

  // Nix
  if (prompt.nixIndicator) {
    const nixText = "via ❄️ ";
    line1Svg += `<text x="${line1X}" y="${y}" class="prompt__nix" fill="${theme.colors.dragonBlue}" font-family="monospace" font-size="${fontSize}">${nixText}</text>`;
    line1X += 60;
  }

  // Line 2: Indicator
  const line2Y = y + lineHeight;
  const line2Svg = `<text x="10" y="${line2Y}" class="prompt__indicator" fill="${theme.colors.springGreen}" font-family="monospace" font-size="${fontSize}">❯</text>`;

  return `
    <g id="prompt">
      ${line1Svg}
      ${line2Svg}

      <!-- Optional blink cursor at end of line 2 -->
      <rect x="25" y="${line2Y - 10}" width="8" height="16" class="cursor" fill="${theme.colors.springGreen}" />
    </g>
  `;
};
