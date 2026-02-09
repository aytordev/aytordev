import type { TechStack, TechStackCategory } from "../../../domain/value-objects/tech-stack";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";
import { getTechIcon } from "./tech-stack-icons";

const ICON_SIZE = 22;
const ICON_GAP = 8;
const LINE_HEIGHT = 30;
const PADDING = 10;
const TITLE_OFFSET = 100;
const TITLE_BASELINE = Math.round(ICON_SIZE / 2 + 14 * 0.35);

export const calculateTechStackHeight = (categories: readonly TechStackCategory[]): number => {
  if (categories.length === 0) return 0;
  return PADDING + categories.length * LINE_HEIGHT;
};

const renderIconAt = (icon: { readonly path: string; readonly color: string }, x: number, y: number): string =>
  `<svg x="${x}" y="${y}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24">` +
  `<path d="${icon.path}" fill="${icon.color}"/></svg>`;

const renderFallbackDot = (theme: Theme, x: number, y: number): string =>
  `<circle cx="${x + ICON_SIZE / 2}" cy="${y + ICON_SIZE / 2}" r="${ICON_SIZE / 2 - 2}" fill="${theme.colors.textMuted}"/>`;

const renderRow = (category: TechStackCategory, theme: Theme, rowY: number): string => {
  const titleSvg =
    `<text x="0" y="${TITLE_BASELINE}" class="stack__title" fill="${theme.colors.oniViolet}" font-family="monospace" font-size="14" font-weight="bold">` +
    `${sanitizeForSvg(category.name)}</text>`;

  const iconsSvg = category.items
    .map((item, i) => {
      const icon = getTechIcon(item);
      const ix = TITLE_OFFSET + i * (ICON_SIZE + ICON_GAP);
      return icon !== null
        ? renderIconAt(icon, ix, 0)
        : renderFallbackDot(theme, ix, 0);
    })
    .join("\n");

  return `<g transform="translate(0, ${rowY})">\n${titleSvg}\n${iconsSvg}\n</g>`;
};

export const renderTechStack = (
  stack: TechStack,
  theme: Theme,
  x: number = 0,
  y: number = 0,
): string => {
  if (stack.categories.length === 0) {
    return `<g id="tech-stack" transform="translate(${x}, ${y})"></g>`;
  }

  const rows = stack.categories
    .map((category, index) => renderRow(category, theme, index * LINE_HEIGHT))
    .join("\n");

  return `<g id="tech-stack" transform="translate(${x}, ${y})">\n${rows}\n</g>`;
};
