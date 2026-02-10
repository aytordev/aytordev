import type { NeofetchData, NeofetchStats } from "../../../domain/entities/terminal-content";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

const INFO_LINE_HEIGHT = 18;
const INFO_LINES = 7;
// Text visual bounds: ascent (~11px above first baseline) to descent (~3px below last).
// Baselines span (INFO_LINES-1)*LINE_HEIGHT = 108px, visual height ≈ 11+108+3 = 122px.
// Logo and text share the same visual center for proper alignment.
const LOGO_SIZE = 130;
const INFO_Y_OFFSET = 15;
const INFO_X = LOGO_SIZE + 20;
const PADDING = 10;

// NixOS snowflake logo — official SVG paths from nixos-artwork
// The logo is a single lambda arm rotated 6 times (3 per color)
const NIXOS_ARM =
  "m 309.549,-710.388 122.197,211.675 -56.157,0.527 -32.624,-56.869 -32.856,56.565 -27.902,-0.011 -14.291,-24.69 46.81,-80.49 -33.229,-57.826 z";

// [angle, cx, cy] — rotation centers from the official Inkscape source
const C1_ARMS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 0, 0],
  [60, 407.112, -715.787],
  [-60, 407.312, -715.700],
];

const C2_ARMS: ReadonlyArray<readonly [number, number, number]> = [
  [180, 407.419, -715.757],
  [120, 407.339, -716.084],
  [-120, 407.288, -715.870],
];

type InfoLine =
  | { readonly kind: "header"; readonly text: string }
  | { readonly kind: "separator" }
  | { readonly kind: "subtitle"; readonly text: string }
  | {
      readonly kind: "pair";
      readonly left: { readonly label: string; readonly value: string };
      readonly right: { readonly label: string; readonly value: string };
    }
  | { readonly kind: "single"; readonly label: string; readonly value: string }
  | { readonly kind: "stats"; readonly stats: NeofetchStats };

const buildInfoLines = (data: NeofetchData): ReadonlyArray<InfoLine> => [
  { kind: "header", text: `@${data.owner.username}` },
  { kind: "separator" },
  { kind: "subtitle", text: `${data.owner.tagline} · 📍 ${data.owner.location}` },
  { kind: "pair", left: { label: "OS", value: data.system.os }, right: { label: "Shell", value: data.system.shell } },
  {
    kind: "pair",
    left: { label: "Editor", value: data.system.editor },
    right: { label: "Terminal", value: data.system.terminal },
  },
  data.system.wm !== undefined
    ? {
        kind: "pair",
        left: { label: "Theme", value: data.system.theme },
        right: { label: "WM", value: data.system.wm },
      }
    : { kind: "single", label: "Theme", value: data.system.theme },
  { kind: "stats", stats: data.stats },
];

const renderArmPath = (rotation: readonly [number, number, number]): string => {
  const [angle, cx, cy] = rotation;
  const transform = angle === 0 ? "" : ` transform="rotate(${angle}, ${cx}, ${cy})"`;
  return `<path d="${NIXOS_ARM}"${transform} />`;
};

const renderNixosLogoSvg = (theme: Theme): string => {
  const c1 = theme.colors.springBlue;
  const c2 = theme.colors.waveAqua;

  const c1Paths = C1_ARMS.map(renderArmPath).join("");
  const c2Paths = C2_ARMS.map(renderArmPath).join("");

  return (
    `<svg x="0" y="0" width="${LOGO_SIZE}" height="${LOGO_SIZE}" viewBox="0 0 501.56 501.56">` +
    `<g transform="translate(-156.41, 933.31)">` +
    `<g transform="matrix(0.99994,0,0,0.99994,-0.063,33.188)">` +
    `<g fill="${c1}">${c1Paths}</g>` +
    `<g fill="${c2}">${c2Paths}</g>` +
    `</g></g></svg>`
  );
};

const renderInfoLineSvg = (line: InfoLine, index: number, theme: Theme): string => {
  const y = index * INFO_LINE_HEIGHT;

  switch (line.kind) {
    case "header":
      return `<text x="${INFO_X}" y="${y}" fill="${theme.colors.springBlue}" font-family="monospace" font-size="14" font-weight="bold">${sanitizeForSvg(line.text)}</text>`;

    case "separator":
      return `<text x="${INFO_X}" y="${y}" fill="${theme.colors.textMuted}" font-family="monospace" font-size="12">───────────────────</text>`;

    case "subtitle":
      return `<text x="${INFO_X}" y="${y}" fill="${theme.colors.textSecondary}" font-family="monospace" font-size="12">${sanitizeForSvg(line.text)}</text>`;

    case "pair":
      return (
        `<text x="${INFO_X}" y="${y}" font-family="monospace" font-size="12">` +
        `<tspan fill="${theme.colors.springBlue}" font-weight="bold">${sanitizeForSvg(line.left.label)}</tspan>` +
        `<tspan fill="${theme.colors.text}">: ${sanitizeForSvg(line.left.value)}</tspan>` +
        `<tspan fill="${theme.colors.textMuted}"> · </tspan>` +
        `<tspan fill="${theme.colors.springBlue}" font-weight="bold">${sanitizeForSvg(line.right.label)}</tspan>` +
        `<tspan fill="${theme.colors.text}">: ${sanitizeForSvg(line.right.value)}</tspan>` +
        `</text>`
      );

    case "single":
      return (
        `<text x="${INFO_X}" y="${y}" font-family="monospace" font-size="12">` +
        `<tspan fill="${theme.colors.springBlue}" font-weight="bold">${sanitizeForSvg(line.label)}</tspan>` +
        `<tspan fill="${theme.colors.text}">: ${sanitizeForSvg(line.value)}</tspan>` +
        `</text>`
      );

    case "stats":
      return (
        `<text x="${INFO_X}" y="${y}" font-family="monospace" font-size="12">` +
        `<tspan fill="${theme.colors.carpYellow}">📊 ${line.stats.totalCommits}</tspan>` +
        `<tspan fill="${theme.colors.textMuted}">  </tspan>` +
        `<tspan fill="${theme.colors.surimiOrange}">🔥 ${line.stats.currentStreak}d</tspan>` +
        `<tspan fill="${theme.colors.textMuted}">  </tspan>` +
        `<tspan fill="${theme.colors.springGreen}">📦 ${line.stats.publicRepos}</tspan>` +
        `</text>`
      );
  }
};

export const calculateNeofetchHeight = (_data: NeofetchData): number =>
  PADDING + Math.max(LOGO_SIZE, INFO_LINES * INFO_LINE_HEIGHT);

export const renderNeofetch = (
  data: NeofetchData,
  theme: Theme,
  y: number = 0,
): Readonly<{ svg: string; height: number }> => {
  const infoLines = buildInfoLines(data);
  const height = calculateNeofetchHeight(data);

  const logoSvg = renderNixosLogoSvg(theme);
  const infoSvg = infoLines.map((line, i) => renderInfoLineSvg(line, i, theme)).join("\n");

  const svg =
    `<g id="neofetch" transform="translate(0, ${y})">` +
    `<g class="neofetch__logo">${logoSvg}</g>` +
    `<g class="neofetch__info" transform="translate(0, ${INFO_Y_OFFSET})">${infoSvg}</g>` +
    `</g>`;

  return { svg, height };
};
