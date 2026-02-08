import type { TerminalState } from "../../../domain/entities/terminal-state";
import type { Theme } from "../../../theme/types";
import { sanitizeForSvg } from "../../../shared/sanitize";
import {
  buildCommandSequence,
  calculateLayout,
  createAnimationTiming,
  generateAllScrollKeyframes,
} from "./terminal-session";
import { renderPrompt } from "./prompt.renderer";

/**
 * Renders an animated terminal session with scroll simulation.
 * Main orchestrator - composes pure functions.
 *
 * Pure function: state + theme + dimensions -> SVG string
 *
 * @param state - Terminal state with content and configuration
 * @param theme - Theme configuration for colors and styling
 * @param viewportY - Y position where viewport starts
 * @param viewportHeight - Height of visible viewport
 * @returns SVG string with animated terminal session
 */
export const renderTerminalSession = (
  state: TerminalState,
  theme: Theme,
  viewportY: number,
  viewportHeight: number,
): string => {
  // 1. Build command sequence (pure)
  const commands = buildCommandSequence(state);

  // 2. Calculate timing configuration (pure)
  const speed = state.animation?.speed ?? 1;
  const timing = createAnimationTiming(speed);

  // 3. Calculate layout (pure)
  const layout = calculateLayout(commands, viewportHeight, timing, theme);

  // 4. Generate scroll keyframes (pure)
  const scrollKeyframes = generateAllScrollKeyframes(layout.scrollPoints);

  // 5. Render commands to SVG (pure, functional composition)
  const commandsSvg = commands
    .map((cmd, i) => renderCommand(cmd, layout, i, theme, timing))
    .join("\n");

  // 6. Compose final SVG structure (pure template)
  return composeTerminalSessionSvg(
    viewportY,
    viewportHeight,
    scrollKeyframes,
    commandsSvg,
    state.prompt,
    theme,
    timing,
  );
};

/**
 * Renders a single animated command with its output.
 * Pure function.
 *
 * @param cmd - Command to render
 * @param layout - Layout calculation result
 * @param index - Command index in sequence
 * @param theme - Theme configuration
 * @param timing - Animation timing configuration
 * @returns SVG string for command and output
 */
const renderCommand = (
  cmd: { command: string; outputRenderer: (theme: Theme, y: number) => { svg: string; height: number } },
  layout: { positions: ReadonlyArray<number>; timings: ReadonlyArray<{ commandStart: number; outputStart: number }> },
  index: number,
  theme: Theme,
  timing: { typingDuration: number; fadeDuration: number; commandDelay: number; initialDelay: number },
): string => {
  const y = layout.positions[index];
  const cmdTiming = layout.timings[index];

  const commandLine = `<text
    x="10"
    y="${y}"
    class="command-line animate terminal-text"
    fill="${theme.colors.text}"
    style="animation-delay: ${cmdTiming.commandStart}s"
  >$ ${sanitizeForSvg(cmd.command)}</text>`;

  const output = cmd.outputRenderer(theme, y + 20);
  const outputWrapped = `<g
    class="command-output animate"
    style="animation-delay: ${cmdTiming.outputStart}s"
  >${output.svg}</g>`;

  return `${commandLine}\n${outputWrapped}`;
};

/**
 * Composes the final SVG structure.
 * Pure function - string template composition.
 *
 * @param viewportY - Y position where viewport starts
 * @param viewportHeight - Height of visible viewport
 * @param scrollKeyframes - CSS keyframes for scroll animations
 * @param commandsSvg - Rendered commands SVG
 * @param prompt - Starship prompt configuration
 * @param theme - Theme configuration
 * @param timing - Animation timing configuration
 * @returns Complete SVG structure
 */
const composeTerminalSessionSvg = (
  viewportY: number,
  viewportHeight: number,
  scrollKeyframes: string,
  commandsSvg: string,
  prompt: TerminalState["prompt"],
  theme: Theme,
  timing: { typingDuration: number; fadeDuration: number; commandDelay: number; initialDelay: number },
): string => {
  const initialPrompt = renderInitialPrompt(prompt, theme);

  return `
  <defs>
    <clipPath id="terminal-viewport">
      <rect x="0" y="${viewportY}" width="800" height="${viewportHeight}" />
    </clipPath>
    ${scrollKeyframes ? `<style>${scrollKeyframes}</style>` : ""}
  </defs>

  <g clip-path="url(#terminal-viewport)">
    <g id="scrollable-content" class="terminal-scroll">
      ${initialPrompt}
      ${commandsSvg}
    </g>
  </g>
`.trim();
};

/**
 * Renders the initial prompt (before commands).
 * Pure function.
 *
 * @param prompt - Starship prompt configuration
 * @param theme - Theme configuration
 * @returns SVG string for initial prompt
 */
const renderInitialPrompt = (
  prompt: TerminalState["prompt"],
  theme: Theme,
): string => {
  // Render just the prompt without command text
  const promptSvg = renderPrompt(prompt, theme, 0, 20);

  return `<g class="initial-prompt">${promptSvg}</g>`;
};
