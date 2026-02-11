import type { JourneyEntry } from "../../../domain/value-objects/journey-entry";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

const LINE_HEIGHT = 24;
const ROW_BOTTOM_EXTENT = 4; // Tag rect bottom: y=-12 + height=16 = 4px below baseline
const YEAR_X = 24;
const TITLE_X = 80;
const TITLE_CHAR_WIDTH = 7.2; // approximate monospace char width at font-size 12
const MIN_TAG_START_X = 280;
const TAG_CHAR_WIDTH = 7; // monospace char width at font-size 10
const TAG_PADDING = 12; // horizontal padding inside tag rect
const TAG_GAP = 8;
const TAG_TITLE_GAP = 16; // min gap between title end and first tag

const tagWidth = (tag: string): number => tag.length * TAG_CHAR_WIDTH + TAG_PADDING;

const renderTag = (tag: string, x: number, theme: Theme): string =>
  `<rect x="${x}" y="-12" width="${tagWidth(tag)}" height="16" rx="3" fill="${theme.colors.sumiInk3}"/>` +
  `<text x="${x + 6}" y="0" fill="${theme.colors.waveAqua}" font-family="monospace" font-size="10">${sanitizeForSvg(tag)}</text>`;

const renderEntryTags = (tags: ReadonlyArray<string>, tagStartX: number, theme: Theme): string => {
  if (tags.length === 0) return "";
  let x = tagStartX;
  const parts: string[] = [];
  for (const tag of tags) {
    parts.push(renderTag(tag, x, theme));
    x += tagWidth(tag) + TAG_GAP;
  }
  return parts.join("\n");
};

const calculateTagStartX = (entries: ReadonlyArray<JourneyEntry>): number => {
  const maxTitleLength = Math.max(...entries.map((e) => e.title.length));
  const titleEndX = TITLE_X + maxTitleLength * TITLE_CHAR_WIDTH;
  return Math.max(MIN_TAG_START_X, Math.ceil(titleEndX) + TAG_TITLE_GAP);
};

const renderEntry = (entry: JourneyEntry, index: number, tagStartX: number, theme: Theme): string => {
  const y = index * LINE_HEIGHT;

  const iconSvg = `<text x="0" y="0" font-family="monospace" font-size="14">${sanitizeForSvg(entry.icon)}</text>`;
  const yearSvg = `<text x="${YEAR_X}" y="0" fill="${theme.colors.carpYellow}" font-family="monospace" font-size="12" font-weight="bold">${entry.year}</text>`;
  const titleSvg = `<text x="${TITLE_X}" y="0" fill="${theme.colors.text}" font-family="monospace" font-size="12">${sanitizeForSvg(entry.title)}</text>`;

  const tagsSvg = renderEntryTags(entry.tags ?? [], tagStartX, theme);

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

  const tagStartX = calculateTagStartX(entries);
  const entriesSvg = entries.map((entry, i) => renderEntry(entry, i, tagStartX, theme)).join("\n");

  const svg = `<g id="journey" transform="translate(0, ${y})">` + entriesSvg + `</g>`;

  return { svg, height };
};
