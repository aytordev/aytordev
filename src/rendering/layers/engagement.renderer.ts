import { sanitizeForSvg } from "../../shared/sanitize";
import type { Theme } from "../../theme/types";

export interface EngagementContent {
  learningJourney?: { current: string } | null;
  todayFocus?: string | null;
  dailyQuote?: string | null;
}

export const renderEngagement = (
  content: EngagementContent,
  theme: Theme,
  y: number = 0,
): string => {
  if (!content.learningJourney && !content.todayFocus && !content.dailyQuote) {
    return "<g></g>";
  }

  let elements = "";
  let currentY = 0;
  const lineHeight = 24;

  // Learning Journey
  if (content.learningJourney) {
    elements += `
      <text x="0" y="${currentY}" fill="${theme.colors.fujiWhite}" font-size="14" font-family="monospace">
        📚 Learning Journey
      </text>
      <text x="20" y="${currentY + lineHeight}" fill="${theme.colors.text}" font-size="13" font-family="monospace">
        ${sanitizeForSvg(content.learningJourney.current)}
      </text>
    `;
    currentY += lineHeight * 2 + 10;
  }

  // Today Focus
  if (content.todayFocus) {
    elements += `
      <text x="0" y="${currentY}" fill="${theme.colors.fujiWhite}" font-size="14" font-family="monospace">
        🎯 Today's Focus
      </text>
      <text x="20" y="${currentY + lineHeight}" fill="${theme.colors.text}" font-size="13" font-family="monospace">
        ${sanitizeForSvg(content.todayFocus)}
      </text>
    `;
    currentY += lineHeight * 2 + 10;
  }

  // Daily Quote
  if (content.dailyQuote) {
    elements += `
      <text x="0" y="${currentY}" fill="${theme.colors.fujiWhite}" font-size="14" font-family="monospace">
        💬 Daily Quote
      </text>
      <text x="20" y="${currentY + lineHeight}" fill="${theme.colors.textMuted}" font-size="13" font-family="monospace" font-style="italic">
        "${sanitizeForSvg(content.dailyQuote)}"
      </text>
    `;
    currentY += lineHeight * 2 + 10;
  }

  return `
    <g id="engagement" transform="translate(0, ${y})">
      ${elements}
    </g>
  `.trim();
};
