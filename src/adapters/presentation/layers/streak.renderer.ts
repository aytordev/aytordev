import type { StreakInfo } from "../../../domain/value-objects/streak-info";
import type { Theme } from "../../../theme/types";

export const renderStreak = (streak: StreakInfo, theme: Theme, x: number, y: number): string => {
  if (streak.currentStreak === 0) {
    return "<g></g>";
  }

  return `
    <g id="streak" transform="translate(${x}, ${y})">
      <!-- Fire Emoji -->
      <text x="0" y="0" class="streak__fire" font-size="24" filter="url(#glow)">🔥</text>

      <!-- Streak Count -->
      <text x="35" y="0" class="streak__count" fill="${theme.colors.surimiOrange}" font-family="monospace" font-size="14" font-weight="bold" dominant-baseline="middle">
        ${streak.currentStreak} day streak
      </text>
    </g>
  `.trim();
};
