import type { DeveloperInfo, NeofetchData, NeofetchStats } from "../../../domain/entities/terminal-content";
import type { SystemInfo } from "../../../domain/value-objects/system-info";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

const LINE_HEIGHT = 18;
const ASCII_WIDTH = 200;
const INFO_X = ASCII_WIDTH + 20;
const PADDING = 10;

interface InfoLine {
  readonly label: string;
  readonly value: string;
}

const ASCII_ART: ReadonlyArray<string> = [
  "      ___     ",
  "     (.. |    ",
  "     (<> |    ",
  "    / __  \\   ",
  "   ( /  \\ /|  ",
  "  _/\\ __)/_)  ",
  "  \\/-____\\/   ",
];

const buildOwnerLines = (owner: DeveloperInfo): ReadonlyArray<InfoLine> => [
  { label: "", value: `@${owner.username}` },
  { label: "", value: owner.tagline },
  { label: "", value: `📍 ${owner.location}` },
];

const buildSystemLines = (system: SystemInfo): ReadonlyArray<InfoLine> => {
  const lines: InfoLine[] = [
    { label: "OS", value: system.os },
    { label: "Shell", value: system.shell },
    { label: "Editor", value: system.editor },
    { label: "Terminal", value: system.terminal },
    { label: "Theme", value: system.theme },
  ];

  if (system.wm !== undefined) {
    return [...lines, { label: "WM", value: system.wm }];
  }

  return lines;
};

const buildStatsLines = (stats: NeofetchStats): ReadonlyArray<InfoLine> => [
  { label: "Commits", value: String(stats.totalCommits) },
  { label: "Streak", value: `${stats.currentStreak} days` },
  { label: "Repos", value: String(stats.publicRepos) },
];

const buildInfoLines = (data: NeofetchData): ReadonlyArray<InfoLine> => [
  ...buildOwnerLines(data.owner),
  { label: "─────", value: "──────────" },
  ...buildSystemLines(data.system),
  { label: "─────", value: "──────────" },
  ...buildStatsLines(data.stats),
];

const countInfoLines = (data: NeofetchData): number =>
  buildInfoLines(data).length;

const renderAsciiArtSvg = (theme: Theme): string =>
  ASCII_ART.map(
    (line, i) =>
      `<text x="0" y="${i * LINE_HEIGHT}" fill="${theme.colors.springBlue}" font-family="monospace" font-size="12">${sanitizeForSvg(line)}</text>`,
  ).join("\n");

const renderInfoLineSvg = (line: InfoLine, index: number, theme: Theme): string => {
  const y = index * LINE_HEIGHT;

  if (line.label === "" ) {
    const isUsername = line.value.startsWith("@");
    const fill = isUsername ? theme.colors.springBlue : theme.colors.textSecondary;
    const weight = isUsername ? "bold" : "normal";
    const size = isUsername ? 14 : 12;
    return `<text x="${INFO_X}" y="${y}" fill="${fill}" font-family="monospace" font-size="${size}" font-weight="${weight}">${sanitizeForSvg(line.value)}</text>`;
  }

  if (line.label.startsWith("─")) {
    return `<text x="${INFO_X}" y="${y}" fill="${theme.colors.textMuted}" font-family="monospace" font-size="12">${line.label}${line.value}</text>`;
  }

  return (
    `<text x="${INFO_X}" y="${y}" font-family="monospace" font-size="12">` +
    `<tspan fill="${theme.colors.springBlue}" font-weight="bold">${sanitizeForSvg(line.label)}</tspan>` +
    `<tspan fill="${theme.colors.text}">: ${sanitizeForSvg(line.value)}</tspan>` +
    `</text>`
  );
};

export const calculateNeofetchHeight = (data: NeofetchData): number => {
  const infoLineCount = countInfoLines(data);
  const asciiLineCount = ASCII_ART.length;
  const maxLines = Math.max(infoLineCount, asciiLineCount);
  return PADDING + maxLines * LINE_HEIGHT;
};

export const renderNeofetch = (
  data: NeofetchData,
  theme: Theme,
  y: number = 0,
): Readonly<{ svg: string; height: number }> => {
  const infoLines = buildInfoLines(data);
  const height = calculateNeofetchHeight(data);

  const asciiSvg = renderAsciiArtSvg(theme);
  const infoSvg = infoLines
    .map((line, i) => renderInfoLineSvg(line, i, theme))
    .join("\n");

  const svg =
    `<g id="neofetch" transform="translate(0, ${y})">` +
    `<g class="neofetch__ascii">${asciiSvg}</g>` +
    `<g class="neofetch__info">${infoSvg}</g>` +
    `</g>`;

  return { svg, height };
};
