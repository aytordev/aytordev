import type { DeveloperInfo } from "../../domain/entities/terminal-content";
import type { Theme } from "../../theme/types";

export const renderDeveloperInfo = (
  info: DeveloperInfo,
  theme: Theme,
): string => {
  const lineHeight = 20;

  return `
    <g id="developer-info">
      <!-- Username -->
      <text x="0" y="0" class="dev__username" fill="${theme.colors.text}" font-family="monospace" font-size="16" font-weight="bold">@${info.username}</text>

      <!-- Role / Tagline -->
      <text x="0" y="${lineHeight}" class="dev__role" fill="${theme.colors.textSecondary}" font-family="monospace" font-size="14">${info.tagline}</text>

      <!-- Location -->
      <text x="0" y="${lineHeight * 2}" class="dev__location" fill="${theme.colors.textMuted}" font-family="monospace" font-size="12">📍 ${info.location}</text>
    </g>
  `.trim();
};
