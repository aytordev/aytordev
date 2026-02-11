import type { StarshipPrompt } from "../../../domain/entities/starship-prompt";
import type { TerminalState } from "../../../domain/entities/terminal-state";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";
import { renderPromptLeftSide, renderPromptRightSide } from "./prompt.renderer";
import {
  buildCommandSequence,
  type CommandTiming,
  calculateLayout,
  createAnimationTiming,
  generateAllScrollKeyframes,
} from "./terminal-session";
import { COMMAND_LINE_HEIGHT, OUTPUT_GAP, PROMPT_HEIGHT } from "./terminal-session/types";

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

  // 5. Generate CSS reveal timing for prompts and outputs (pure)
  const revealCss = generateRevealCss(layout.timings, timing.fadeDuration);

  // 6. Render commands to SVG (pure, functional composition)
  // Each command includes: prompt (CSS reveal) + command line (SMIL typing) + output (CSS reveal)
  const commandsSvg = commands
    .map((cmd, i) => renderCommand(cmd, layout, i, theme, state.prompt))
    .join("\n");

  // 7. Compose final SVG structure (pure template)
  return composeTerminalSessionSvg(
    viewportY,
    viewportHeight,
    scrollKeyframes,
    revealCss,
    commandsSvg,
  );
};

/**
 * Renders a single animated command block with prompt, command line, and output.
 * Pure function.
 *
 * Block structure:
 * - Prompt line 1 (CSS reveal): directory → git:branch
 * - Command line 2 (SMIL typewriter): $ command
 * - Output section (CSS reveal): command output
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
    outputRenderer: (theme: Theme, y: number) => { svg: string; height: number };
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

  // 1. Render prompt - CSS handles reveal timing via .prompt-{index} class
  const promptY = y + PROMPT_HEIGHT; // Text baseline
  const promptSvg = renderPromptForCommand(prompt, theme, promptY, index);

  // 2. Render command line with typing animation via clipPath
  const commandY = y + PROMPT_HEIGHT + COMMAND_LINE_HEIGHT;
  const commandText = `$ ${sanitizeForSvg(cmd.command)}`;
  const charCount = cmd.command.length + 2; // Visual chars: "$ " prefix + original command (not sanitized entity length)
  // Approximate character width in monospace font at 14px
  const charWidth = 8.4;
  const textWidth = charCount * charWidth;
  const clipId = `typing-clip-${index}`;
  const cursorId = `cursor-${index}`;
  const typingDuration = cmdTiming.outputStart - cmdTiming.commandStart;

  // Create clipPath with animated rect that reveals text letter by letter
  const clipPathDef = `
    <defs>
      <clipPath id="${clipId}">
        <rect x="10" y="${commandY - 14}" width="0" height="20">
          <animate
            attributeName="width"
            from="0"
            to="${textWidth}"
            dur="${typingDuration}s"
            begin="${cmdTiming.commandStart}s"
            fill="freeze"
            calcMode="discrete"
            keyTimes="${generateKeyTimesForTyping(charCount)}"
            values="${generateValuesForTyping(charCount, charWidth)}"
          />
        </rect>
      </clipPath>
    </defs>`;

  // Create blinking cursor that follows the typing
  // Cursor starts hidden and appears only during typing
  const cursorStartX = 10; // Starting position (before first char)
  const cursorHeight = 16;
  const cursorWidth = 2;

  const cursor = `
  <rect
    id="${cursorId}"
    x="${cursorStartX}"
    y="${commandY - 12}"
    width="${cursorWidth}"
    height="${cursorHeight}"
    fill="${theme.colors.springGreen}"
    opacity="0"
  >
    <!-- Show cursor when typing starts -->
    <animate
      attributeName="opacity"
      from="0"
      to="1"
      dur="0.01s"
      begin="${cmdTiming.commandStart}s"
      fill="freeze"
    />
    <!-- Animate cursor position jumping with each character -->
    <animate
      attributeName="x"
      dur="${typingDuration}s"
      begin="${cmdTiming.commandStart}s"
      fill="freeze"
      calcMode="discrete"
      keyTimes="${generateKeyTimesForTyping(charCount)}"
      values="${generateCursorPositions(charCount, charWidth, cursorStartX)}"
    />
    <!-- Blink animation while typing -->
    <animate
      attributeName="opacity"
      values="1;0;1"
      dur="1s"
      begin="${cmdTiming.commandStart}s"
      end="${cmdTiming.outputStart}s"
      repeatCount="indefinite"
    />
    <!-- Hide cursor when typing completes -->
    <set
      attributeName="opacity"
      to="0"
      begin="${cmdTiming.outputStart}s"
      fill="freeze"
    />
  </rect>`;

  const commandLine = `${clipPathDef}
<text
    x="10"
    y="${commandY}"
    class="command-line terminal-text"
    fill="${theme.colors.text}"
    font-family="monospace"
    font-size="14"
    clip-path="url(#${clipId})"
  >${commandText}</text>
${cursor}`;

  // 3. Render output - CSS handles reveal timing via .output-{index} class
  // Output renderers handle their own positioning via internal transforms
  // Indent output slightly from command line for visual hierarchy
  const outputY = commandY + OUTPUT_GAP;
  const output = cmd.outputRenderer(theme, outputY);
  const outputWrapped = `<g class="output-${index}" transform="translate(10, 0)">${output.svg}</g>`;

  return `${promptSvg}\n${commandLine}\n${outputWrapped}`;
};

/**
 * Generates keyTimes for discrete stepping animation (letter by letter).
 * Each step corresponds to revealing one more character.
 * Generates charCount + 1 entries (0/charCount to charCount/charCount).
 * Pure function - functional composition without mutations.
 */
export const generateKeyTimesForTyping = (charCount: number): string => {
  // Handle edge case: division by zero when charCount is 0
  if (charCount === 0) return "0";
  return Array.from({ length: charCount + 1 }, (_, i) => i / charCount).join(";");
};

/**
 * Generates width values for discrete stepping animation.
 * Each value is the width needed to show i characters.
 * Generates charCount + 1 entries to match keyTimes.
 * Pure function - functional composition without mutations.
 */
export const generateValuesForTyping = (charCount: number, charWidth: number): string => {
  // Add full character width extra for each step to ensure full visibility
  return Array.from({ length: charCount + 1 }, (_, i) => i * charWidth + charWidth).join(";");
};

/**
 * Generates X positions for cursor animation.
 * Cursor position matches the right edge of the revealed text.
 * Generates charCount + 1 entries to match keyTimes.
 * Pure function - functional composition without mutations.
 */
export const generateCursorPositions = (
  charCount: number,
  charWidth: number,
  startX: number,
): string => {
  // Match the text reveal: position at right edge of revealed text
  return Array.from({ length: charCount + 1 }, (_, i) => startX + i * charWidth + charWidth).join(
    ";",
  );
};

/**
 * Renders a complete prompt for use before a command.
 * Renders both left side (directory/git info) and right side (time/node/nix).
 * CSS handles reveal timing via .prompt-{index} class.
 * Pure function - composes smaller pure functions.
 *
 * @param prompt - Starship prompt configuration
 * @param theme - Theme configuration
 * @param y - Y position for prompt text
 * @param index - Command index for CSS class
 * @param width - Total width for prompt (default 800)
 * @returns SVG string for prompt with CSS reveal class
 */
const renderPromptForCommand = (
  prompt: StarshipPrompt,
  theme: Theme,
  y: number,
  index: number,
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

  return `<g class="prompt-${index}">
    ${leftSide.svg}
    ${rightSide.svg}
  </g>`;
};

/**
 * Generates CSS rules for progressive reveal of prompts and outputs.
 * Uses animation-fill-mode: both for reliable cross-platform hiding:
 * - Before delay: element at opacity 0 (from 'from' keyframe via backwards fill)
 * - After delay: element fades/steps to opacity 1
 * - If CSS animations stripped: default opacity 1 (progressive enhancement)
 *
 * Pure function - timings array → CSS string.
 */
export const generateRevealCss = (
  timings: ReadonlyArray<CommandTiming>,
  fadeDuration: number,
): string => {
  const rules = timings
    .map(
      (t, i) =>
        `.prompt-${i} { animation: reveal 0.001s step-end ${t.promptStart}s both; }\n` +
        `    .output-${i} { animation: reveal ${fadeDuration}s ease-out ${t.outputStart}s both; }`,
    )
    .join("\n    ");

  return `@keyframes reveal { from { opacity: 0; } to { opacity: 1; } }\n    ${rules}`;
};

/**
 * Composes the final SVG structure.
 * Pure function - string template composition.
 *
 * @param viewportY - Y position where viewport starts
 * @param viewportHeight - Height of visible viewport
 * @param scrollKeyframes - CSS keyframes for scroll animations
 * @param revealCss - CSS rules for progressive reveal timing
 * @param commandsSvg - Rendered commands SVG
 * @returns Complete SVG structure
 */
const composeTerminalSessionSvg = (
  viewportY: number,
  viewportHeight: number,
  scrollKeyframes: string,
  revealCss: string,
  commandsSvg: string,
): string => {
  const cssContent = [revealCss, scrollKeyframes].filter(Boolean).join("\n    ");
  return `
  <defs>
    <clipPath id="terminal-viewport">
      <rect x="0" y="${viewportY}" width="800" height="${viewportHeight}" />
    </clipPath>
    <style>${cssContent}</style>
  </defs>

  <g clip-path="url(#terminal-viewport)">
    <g id="scrollable-content" class="terminal-scroll" transform="translate(0, ${viewportY})">
      ${commandsSvg}
    </g>
  </g>
`.trim();
};
