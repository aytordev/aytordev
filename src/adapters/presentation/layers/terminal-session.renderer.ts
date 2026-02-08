import type { StarshipPrompt } from "../../../domain/entities/starship-prompt";
import type { TerminalState } from "../../../domain/entities/terminal-state";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";
import { renderPromptLeftSide, renderPromptRightSide } from "./prompt.renderer";
import {
  buildCommandSequence,
  calculateLayout,
  createAnimationTiming,
  generateAllScrollKeyframes,
  type CommandTiming,
} from "./terminal-session";
import { COMMAND_LINE_HEIGHT, PROMPT_HEIGHT } from "./terminal-session/types";

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
  const layout = calculateLayout(commands, viewportHeight, timing);

  // 4. Generate scroll keyframes (pure)
  const scrollKeyframes = generateAllScrollKeyframes(layout.scrollPoints);

  // 5. Render commands to SVG (pure, functional composition)
  // Each command includes: prompt (fade-in) + command line (typing) + output (fade-in)
  const commandsSvg = commands
    .map((cmd, i) => renderCommand(cmd, layout, i, theme, state.prompt))
    .join("\n");

  // 6. Compose final SVG structure (pure template)
  return composeTerminalSessionSvg(
    viewportY,
    viewportHeight,
    scrollKeyframes,
    commandsSvg,
  );
};

/**
 * Renders a single animated command block with prompt, command line, and output.
 * Pure function.
 *
 * Block structure:
 * - Prompt line 1 (fade-in): directory → git:branch
 * - Command line 2 (typewriter): $ command
 * - Output section (fade-in): command output
 *
 * @param cmd - Command to render
 * @param layout - Layout calculation result
 * @param index - Command index in sequence
 * @param theme - Theme configuration
 * @param prompt - Starship prompt configuration
 * @returns SVG string for complete command block
 */
const renderCommand = (
  cmd: {
    command: string;
    outputRenderer: (
      theme: Theme,
      y: number,
    ) => { svg: string; height: number };
  },
  layout: {
    positions: ReadonlyArray<number>;
    timings: ReadonlyArray<CommandTiming>;
  },
  index: number,
  theme: Theme,
  prompt: StarshipPrompt,
): string => {
  const y = layout.positions[index];
  const cmdTiming = layout.timings[index];

  // 1. Render prompt with fade-in animation
  const promptY = y + PROMPT_HEIGHT; // Text baseline
  const promptSvg = renderPromptForCommand(
    prompt,
    theme,
    promptY,
    cmdTiming.promptStart,
  );

  // 2. Render command line with typewriter animation
  const commandY = y + PROMPT_HEIGHT + COMMAND_LINE_HEIGHT;
  const commandLine = `<text
    x="10"
    y="${commandY}"
    class="command-line animate terminal-text"
    fill="${theme.colors.text}"
    font-family="monospace"
    font-size="14"
    style="animation-delay: ${cmdTiming.commandStart}s"
  >$ ${sanitizeForSvg(cmd.command)}</text>`;

  // 3. Render output with fade-in animation
  // Output renderers handle their own positioning via internal transforms
  // Indent output slightly from command line for visual hierarchy
  const outputY = commandY + 25; // Gap after command (matches layout.ts OUTPUT_GAP)
  const output = cmd.outputRenderer(theme, outputY);
  const outputWrapped = `<g
    class="command-output animate"
    style="animation-delay: ${cmdTiming.outputStart}s"
    transform="translate(10, 0)"
  >${output.svg}</g>`;

  return `${promptSvg}\n${commandLine}\n${outputWrapped}`;
};

/**
 * Renders a complete prompt for use before a command.
 * Renders both left side (directory/git info) and right side (time/node/nix).
 * Pure function - composes smaller pure functions.
 *
 * @param prompt - Starship prompt configuration
 * @param theme - Theme configuration
 * @param y - Y position for prompt text
 * @param animationDelay - Delay before fade-in starts
 * @param width - Total width for prompt (default 800)
 * @returns SVG string for prompt with animation
 */
const renderPromptForCommand = (
  prompt: StarshipPrompt,
  theme: Theme,
  y: number,
  animationDelay: number,
  width: number = 800,
): string => {
  const fontSize = 14;
  const initialLeftX = 10;
  const rightX = width - 20; // Padding right

  const config = {
    fontSize,
    initialLeftX,
    rightX,
    y,
  };

  // Use pure functions to render both sides
  const leftSide = renderPromptLeftSide(prompt, theme, config);
  const rightSide = renderPromptRightSide(prompt, theme, config);

  return `<g class="command-prompt animate" style="animation-delay: ${animationDelay}s">
    ${leftSide.svg}
    ${rightSide.svg}
  </g>`;
};

/**
 * Composes the final SVG structure.
 * Pure function - string template composition.
 *
 * @param viewportY - Y position where viewport starts
 * @param viewportHeight - Height of visible viewport
 * @param scrollKeyframes - CSS keyframes for scroll animations
 * @param commandsSvg - Rendered commands SVG
 * @returns Complete SVG structure
 */
const composeTerminalSessionSvg = (
  viewportY: number,
  viewportHeight: number,
  scrollKeyframes: string,
  commandsSvg: string,
): string => {
  return `
  <defs>
    <clipPath id="terminal-viewport">
      <rect x="0" y="${viewportY}" width="800" height="${viewportHeight}" />
    </clipPath>
    ${scrollKeyframes ? `<style>${scrollKeyframes}</style>` : ""}
  </defs>

  <g clip-path="url(#terminal-viewport)">
    <g id="scrollable-content" class="terminal-scroll" transform="translate(0, ${viewportY})">
      ${commandsSvg}
    </g>
  </g>
`.trim();
};
