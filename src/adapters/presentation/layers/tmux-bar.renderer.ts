import type { TmuxSession } from "../../../domain/entities/tmux-session";
import type { EasterEggType } from "../../../domain/value-objects/easter-egg";
import type { Theme } from "../../../theme/types";

const CHAR_WIDTH = 8; // Estimate for Monospace 12px
const PADDING = 16;
const BAR_HEIGHT = 24;

const renderSegment = (x: number, width: number, bg: string, fg: string, text: string): string => {
  const yText = BAR_HEIGHT / 2 + 1; // Center vertical
  return `
    <rect x="${x}" y="0" width="${width}" height="${BAR_HEIGHT}" fill="${bg}" />
    <text x="${x + width / 2}" y="${yText}" fill="${fg}" font-family="monospace" font-size="12" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
      ${text}
    </text>
  `;
};

export const renderTmuxBar = (
  session: TmuxSession,
  theme: Theme,
  y: number = 0,
  easterEgg?: EasterEggType,
): string => {
  const { width } = { width: 800 }; // Context provided or passed

  const sessionIndex = "0"; // Mock or from session? sessionName usually string, let's assume index 0 based on screenshot style

  // F28: Easter Egg Logic - pure expression
  const sessionIcon =
    easterEgg === "halloween"
      ? "🎃"
      : easterEgg === "christmas"
        ? "🎄"
        : easterEgg === "may-the-4th"
          ? "🪐"
          : easterEgg === "friday-13th"
            ? "🔪"
            : "👻"; // Default ghostty icon

  const sessionName = ` ${sessionIcon} ${session.sessionName} `;

  const activeWindow = session.windows.find((w) => w.index === session.activeWindowIndex);
  const activeWindowStr = activeWindow ? `${activeWindow.index} ${activeWindow.name}` : "";

  // Build left segments immutably
  const sessWidth = 30 + sessionName.length * 6; // Adjust width for content
  const winWidth = activeWindowStr.length * CHAR_WIDTH + PADDING * 2;

  const leftSegments = [
    // 1. Session Index [0]
    renderSegment(
      0,
      sessWidth,
      theme.colors.sumiInk0, // sumiInk0 is #16161D, very dark
      theme.colors.textMuted,
      sessionName,
    ),
    // 2. Active Window [1 zsh]
    renderSegment(
      sessWidth,
      winWidth,
      theme.colors.bgTuft, // sumiInk2 or sumiInk3
      theme.colors.text,
      activeWindowStr,
    ),
  ];

  // Build right segments immutably
  const ramText = "RAM 17GB/96 GB";
  const ramWidth = ramText.length * CHAR_WIDTH + PADDING;

  const cpuText = `CPU ${session.stats.cpuLoad}%`;
  const cpuWidth = cpuText.length * CHAR_WIDTH + PADDING;

  const branchText = `! 1M ${session.currentBranch ?? "main"}`;
  const branchWidth = branchText.length * CHAR_WIDTH + PADDING;

  // Calculate positions from right to left
  const ramX = 800 - ramWidth;
  const cpuX = ramX - cpuWidth;
  const branchX = cpuX - branchWidth;

  const rightSegments = [
    // 3. Git Info [! 1M chore/setup-project]
    renderSegment(
      branchX,
      branchWidth,
      theme.colors.springViolet1,
      theme.colors.sumiInk3,
      branchText,
    ),
    // 4. CPU [CPU 6%]
    renderSegment(cpuX, cpuWidth, theme.colors.autumnOrange, theme.colors.sumiInk3, cpuText),
    // 5. RAM [RAM 17GB/96 GB]
    renderSegment(ramX, ramWidth, theme.colors.waveAqua, theme.colors.sumiInk3, ramText),
  ];

  const segments = [...leftSegments, ...rightSegments];

  return `
    <g id="tmux-bar" transform="translate(0, ${y})">
      <!-- Base Background -->
      <rect width="100%" height="${BAR_HEIGHT}" fill="${theme.colors.bgDark}" class="tmux__bg" />

      <!-- Segments -->
      ${segments.join("\n")}
    </g>
  `.trim();
};
