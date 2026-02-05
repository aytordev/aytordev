import type { LanguageStat } from "../../domain/value-objects/language-stat";
import type { Theme } from "../../theme/types";

const BAR_HEIGHT = 14;
const ROW_HEIGHT = 24;
const LABEL_WIDTH = 100;
const BAR_MAX_WIDTH = 150;
const PERCENTAGE_OFFSET = 16;

function createLanguageGradient(
  id: string,
  baseColor: string,
  theme: Theme,
): string {
  return `
    <linearGradient id="${id}" x1="0%" x2="100%">
      <stop offset="0%" stop-color="${theme.colors.springBlue}"/>
      <stop offset="100%" stop-color="${baseColor}"/>
    </linearGradient>
  `;
}

export function renderLanguageStats(
  stats: readonly LanguageStat[],
  theme: Theme,
  y = 0,
): string {
  if (stats.length === 0) {
    return "";
  }

  const gradients = stats
    .map((stat, index) =>
      createLanguageGradient(`lang-grad-${index}`, stat.color, theme),
    )
    .join("\n");

  const rows = stats
    .map((stat, index) => {
      const rowY = 24 + index * ROW_HEIGHT;
      const barWidth = Math.max(4, (stat.percentage / 100) * BAR_MAX_WIDTH);

      return `
      <g transform="translate(0, ${rowY})">
        <text fill="${theme.colors.text}" font-family="monospace" font-size="12" dominant-baseline="middle" y="${BAR_HEIGHT / 2}">
          ${stat.name}
        </text>
        <rect x="${LABEL_WIDTH}" y="0" width="${barWidth}" height="${BAR_HEIGHT}" fill="url(#lang-grad-${index})" rx="2"/>
        <text x="${LABEL_WIDTH + BAR_MAX_WIDTH + PERCENTAGE_OFFSET}" fill="${theme.colors.fujiGray}" font-family="monospace" font-size="11" dominant-baseline="middle" y="${BAR_HEIGHT / 2}">
          ${stat.percentage}%
        </text>
      </g>
    `;
    })
    .join("\n");

  return `
    <defs>
      ${gradients}
    </defs>
    <g id="language-stats" transform="translate(16, ${y})">
      <text fill="${theme.colors.fujiGray}" font-family="monospace" font-size="11">
        Code distribution (public repos):
      </text>
      ${rows}
    </g>
  `;
}
