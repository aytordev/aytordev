import type { TechStack, TechStackCategory } from "../../../domain/value-objects/tech-stack";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";
import { getTechIcon } from "./tech-stack-icons";

export const calculateTechStackHeight = (categories: readonly TechStackCategory[]): number => {
  if (categories.length === 0) return 0;
  const TITLE_HEIGHT = 24;
  const ITEM_HEIGHT = 28;
  const PADDING = 20;
  const maxItems = Math.max(...categories.map((c) => c.items.length));
  return PADDING + TITLE_HEIGHT + maxItems * ITEM_HEIGHT;
};

const ICON_SIZE = 24;

const renderIcon = (icon: { readonly path: string; readonly color: string }, y: number): string =>
  `<svg x="0" y="${y - ICON_SIZE}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24">` +
  `<path d="${icon.path}" fill="${icon.color}"/></svg>`;

const renderFallbackDot = (theme: Theme, y: number): string =>
  `<circle cx="5" cy="${y - 4}" r="4" fill="${theme.colors.textMuted}"/>`;

const renderItem = (item: string, theme: Theme, y: number): string => {
  const icon = getTechIcon(item);
  const indicator = icon !== null ? renderIcon(icon, y) : renderFallbackDot(theme, y);
  const textX = icon !== null ? 30 : 15;
  return (
    `${indicator}` +
    `<text x="${textX}" y="${y}" class="stack__item" fill="${theme.colors.text}" font-family="monospace" font-size="12">${sanitizeForSvg(item)}</text>`
  );
};

const renderColumn = (category: TechStackCategory, theme: Theme, columnX: number): string => {
  const TITLE_HEIGHT = 24;
  const ITEM_HEIGHT = 28;

  const titleSvg =
    `<text x="0" y="0" class="stack__title" fill="${theme.colors.roninYellow}" font-family="monospace" font-size="14" font-weight="bold">` +
    `${sanitizeForSvg(category.name)}</text>`;

  const itemsSvg = category.items
    .map((item, i) => renderItem(item, theme, TITLE_HEIGHT + i * ITEM_HEIGHT))
    .join("\n");

  return `<g transform="translate(${columnX}, 0)">\n${titleSvg}\n${itemsSvg}\n</g>`;
};

export const renderTechStack = (
  stack: TechStack,
  theme: Theme,
  x: number = 0,
  y: number = 0,
  width: number = 760,
): string => {
  if (stack.categories.length === 0) {
    return `<g id="tech-stack" transform="translate(${x}, ${y})"></g>`;
  }

  const columnWidth = width / stack.categories.length;

  const columns = stack.categories
    .map((category, index) => renderColumn(category, theme, index * columnWidth))
    .join("\n");

  return `<g id="tech-stack" transform="translate(${x}, ${y})">\n${columns}\n</g>`;
};
