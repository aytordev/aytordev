import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

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

  const lineHeight = 24;

  // Build items array immutably
  interface EngagementItem {
    readonly icon: string;
    readonly title: string;
    readonly text: string;
    readonly textColor: string;
    readonly italic?: boolean;
  }

  const items: EngagementItem[] = [];

  if (content.learningJourney) {
    items.push({
      icon: "📚",
      title: "Learning Journey",
      text: sanitizeForSvg(content.learningJourney.current),
      textColor: theme.colors.text,
    });
  }

  if (content.todayFocus) {
    items.push({
      icon: "🎯",
      title: "Today's Focus",
      text: sanitizeForSvg(content.todayFocus),
      textColor: theme.colors.text,
    });
  }

  if (content.dailyQuote) {
    items.push({
      icon: "💬",
      title: "Daily Quote",
      text: `"${sanitizeForSvg(content.dailyQuote)}"`,
      textColor: theme.colors.textMuted,
      italic: true,
    });
  }

  // Render items immutably using map with accumulated Y position
  const elements = items.map((item, index) => {
    const itemY = index * (lineHeight * 2 + 10);
    return `
      <text x="0" y="${itemY}" fill="${theme.colors.fujiWhite}" font-size="14" font-family="monospace">
        ${item.icon} ${item.title}
      </text>
      <text x="20" y="${itemY + lineHeight}" fill="${item.textColor}" font-size="13" font-family="monospace"${item.italic ? ' font-style="italic"' : ""}>
        ${item.text}
      </text>
    `;
  });

  return `
    <g id="engagement" transform="translate(0, ${y})">
      ${elements.join("\n")}
    </g>
  `.trim();
};
