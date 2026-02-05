import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

export const renderFooter = (
  text: string,
  theme: Theme,
  width: number = 800,
  height: number = 400,
): string => {
  return `
    <g id="footer">
      <text x="${width - 10}" y="${height - 10}" text-anchor="end" fill="${theme.colors.textMuted}" font-size="10" font-family="monospace">
        ${sanitizeForSvg(text)}
      </text>
    </g>
  `.trim();
};
