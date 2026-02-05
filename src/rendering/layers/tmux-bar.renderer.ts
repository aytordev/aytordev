import type { TmuxSession } from "../../domain/entities/tmux-session";
import type { Theme } from "../../theme/types";

const CHAR_WIDTH = 8; // Estimate for Monospace 12px
const PADDING = 16;
const BAR_HEIGHT = 24;

const renderSegment = (
  x: number,
  width: number,
  bg: string,
  fg: string,
  text: string,
): string => {
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
  y: number = 376,
): string => {
  // Left: Session (index) + Active Window
  const sessionIndex = "0"; // Mock or from session? sessionName usually string, let's assume index 0 based on screenshot style
  const activeWindow = session.windows.find(
    (w) => w.index === session.activeWindowIndex,
  );
  const activeWindowStr = activeWindow
    ? `${activeWindow.index} ${activeWindow.name}`
    : "";

  let currentX = 0;
  const segments: string[] = [];

  // 1. Session Index [0]
  // Color: Darker Background (bgDark is sumiInk4, sess uses sumiInk3 or similar depth)
  // Screenshot shows very dark grey.
  const sessWidth = 30;
  segments.push(
    renderSegment(
      currentX,
      sessWidth,
      theme.colors.sumiInk0, // sumiInk0 is #16161D, very dark
      theme.colors.textMuted,
      sessionIndex,
    ),
  );
  currentX += sessWidth;

  // 2. Active Window [1 zsh]
  // Color: sumiInk6 or selection
  const winWidth = activeWindowStr.length * CHAR_WIDTH + PADDING * 2;
  segments.push(
    renderSegment(
      currentX,
      winWidth,
      theme.colors.bgTuft, // sumiInk2 or sumiInk3
      theme.colors.text,
      activeWindowStr,
    ),
  );

  // Right Side Calculation
  // We align from right to left: RAM <- CPU <- Git
  // Width: 800
  let rightX = 800;

  // 5. RAM [RAM 17GB/96 GB]
  // info: waveAqua (#6a9589), Text: Dark (sumiInk3: #363646)
  const ramText = "RAM 17GB/96 GB";
  const ramWidth = ramText.length * CHAR_WIDTH + PADDING;
  rightX -= ramWidth;
  segments.push(
    renderSegment(
      rightX,
      ramWidth,
      theme.colors.waveAqua,
      theme.colors.sumiInk3,
      ramText,
    ),
  );

  // 4. CPU [CPU 6%]
  // notice: autumnOrange (#dca561), Text: Dark (sumiInk3)
  const cpuText = `CPU ${session.stats.cpuLoad}%`;
  const cpuWidth = cpuText.length * CHAR_WIDTH + PADDING;
  rightX -= cpuWidth;
  segments.push(
    renderSegment(
      rightX,
      cpuWidth,
      theme.colors.autumnOrange,
      theme.colors.sumiInk3,
      cpuText,
    ),
  );

  // 3. Git Info [! 1M chore/setup-project]
  // accent: springViolet1 (#938aa9), Text: Dark (sumiInk3)
  const branchText = `! 1M ${session.currentBranch ?? "main"}`;
  const branchWidth = branchText.length * CHAR_WIDTH + PADDING;
  rightX -= branchWidth;
  segments.push(
    renderSegment(
      rightX,
      branchWidth,
      theme.colors.springViolet1,
      theme.colors.sumiInk3,
      branchText,
    ),
  );

  // Background for the whole bar (filler)
  // Fill the gap between Left and Right
  // <rect width="100%" ... > is already what we had.
  // Actually, the screenshot shows the "empty" space is just the bar background.

  return `
    <g id="tmux-bar" transform="translate(0, ${y})">
      <!-- Base Background -->
      <rect width="100%" height="${BAR_HEIGHT}" fill="${theme.colors.bgDark}" class="tmux__bg" />

      <!-- Segments -->
      ${segments.join("\n")}
    </g>
  `.trim();
};
