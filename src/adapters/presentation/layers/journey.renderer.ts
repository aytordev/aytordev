import type { JourneyEntry } from "../../../domain/value-objects/journey-entry";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

const LINE_HEIGHT = 24;
const ROW_BOTTOM_EXTENT = 6; // Tag rect bottom: y=-10 + height=16 = 6px below baseline
const YEAR_X = 24;
const TITLE_X = 80;
const TAG_START_X = 280;
const TAG_GAP = 8;

const renderTag = (tag: string, x: number, theme: Theme): string =>
  `<rect x="${x}" y="-10" width="${tag.length * 7 + 12}" height="16" rx="3" fill="${theme.colors.sumiInk3}"/>` +
  `<text x="${x + 6}" y="2" fill="${theme.colors.waveAqua}" font-family="monospace" font-size="10">${sanitizeForSvg(tag)}</text>`;

const renderEntry = (entry: JourneyEntry, index: number, theme: Theme): string => {
  const y = index * LINE_HEIGHT;

  const iconSvg = `<text x="0" y="0" font-family="monospace" font-size="14">${sanitizeForSvg(entry.icon)}</text>`;
  const yearSvg = `<text x="${YEAR_X}" y="0" fill="${theme.colors.carpYellow}" font-family="monospace" font-size="12" font-weight="bold">${entry.year}</text>`;
  const titleSvg = `<text x="${TITLE_X}" y="0" fill="${theme.colors.text}" font-family="monospace" font-size="12">${sanitizeForSvg(entry.title)}</text>`;

  const tagsSvg = (entry.tags ?? [])
    .map((tag, i) => renderTag(tag, TAG_START_X + i * (tag.length * 7 + 12 + TAG_GAP), theme))
    .join("\n");

  return `<g transform="translate(0, ${y})">${iconSvg}\n${yearSvg}\n${titleSvg}\n${tagsSvg}</g>`;
};

export const calculateJourneyHeight = (entries: ReadonlyArray<JourneyEntry>): number => {
  if (entries.length === 0) return 0;
  return (entries.length - 1) * LINE_HEIGHT + ROW_BOTTOM_EXTENT;
};

export const renderJourney = (
  entries: ReadonlyArray<JourneyEntry>,
  theme: Theme,
  y: number = 0,
): Readonly<{ svg: string; height: number }> => {
  const height = calculateJourneyHeight(entries);

  if (entries.length === 0) {
    return { svg: `<g id="journey" transform="translate(0, ${y})"></g>`, height: 0 };
  }

  const entriesSvg = entries.map((entry, i) => renderEntry(entry, i, theme)).join("\n");

  const svg = `<g id="journey" transform="translate(0, ${y})">` + entriesSvg + `</g>`;

  return { svg, height };
};
