import type { TmuxSession } from "../../domain/entities/tmux-session";
import type { Theme } from "../../theme/types";

export function renderTmuxBar(session: TmuxSession, theme: Theme): string {
  // Constants for layout
  const barHeight = 24;
  const fontSize = 12;
  // Use explicit theme values instead of CSS classes where structure requires coordinates,
  // but keep classes for styling references where possible.
  // Tests expect classes "tmux__bg", "tmux__left", etc.

  const windowsStr = session.windows
    .map(
      (w) =>
        `${w.index}:${w.name}${w.index === session.activeWindowIndex ? "*" : ""}`,
    )
    .join(" ");

  const leftContent = `[${session.sessionName}] ${windowsStr}`;
  const rightContent = `${session.stats.cpuLoad}% | ${session.stats.uptime}`;

  // Center alignment logic for branch
  // Assuming strict 800px width for now, based on base config
  const width = 800;
  const yText = barHeight - 8; // vertically centered approx

  return `
    <g id="tmux-bar" transform="translate(0, ${400 - barHeight})">
      <!-- Background -->
      <rect width="100%" height="${barHeight}" fill="${theme.colors.bgDark}" class="tmux__bg" />

      <!-- Left: Session & Windows -->
      <text x="10" y="${yText}" class="tmux__left" fill="${theme.colors.textMuted}" font-family="monospace" font-size="${fontSize}">
        ${leftContent}
      </text>

      <!-- Center: Git Branch -->
      ${
        session.currentBranch
          ? `
      <text x="50%" y="${yText}" text-anchor="middle" class="tmux__center" fill="${theme.colors.roninYellow}" font-family="monospace" font-size="${fontSize}">
        ${session.currentBranch}
      </text>
      `
          : ""
      }

      <!-- Right: Stats -->
      <text x="${width - 10}" y="${yText}" text-anchor="end" class="tmux__right" fill="${theme.colors.crystalBlue}" font-family="monospace" font-size="${fontSize}">
        ${rightContent}
      </text>
    </g>
  `.trim();
}
