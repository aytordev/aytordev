import { createMockTheme } from "../../../../tests/mocks/theme";
import type {
  AnimatedCommand,
  AnimationTiming,
  CommandTiming,
  LayoutResult,
  ScrollPoint,
} from "./types";
import {
  COMMAND_LINE_HEIGHT,
  CONTENT_BOTTOM_GAP,
  OUTPUT_GAP,
  PROMPT_FADE_DURATION,
  PROMPT_HEIGHT,
} from "./types";

/**
 * Internal accumulator type for reduce operation.
 */
interface LayoutAccumulator {
  readonly positions: ReadonlyArray<number>;
  readonly timings: ReadonlyArray<CommandTiming>;
  readonly scrollPoints: ReadonlyArray<ScrollPoint>;
  readonly currentY: number;
  readonly currentTime: number;
  readonly totalHeight: number;
}

/**
 * Calculates layout (positions, timings) for all commands.
 * Pure function - uses fold/reduce pattern for immutable state accumulation.
 *
 * Each command block consists of:
 * - Prompt line 1 (directory/git info) - fades in first
 * - Command line 2 ($ command) - types after prompt appears
 * - Output section - fades in after command completes
 *
 * @param commands - Sequence of commands to layout
 * @param viewportHeight - Height of visible viewport
 * @param timing - Animation timing configuration
 * @returns Complete layout result
 */
export const calculateLayout = (
  commands: ReadonlyArray<AnimatedCommand>,
  viewportHeight: number,
  timing: AnimationTiming,
): LayoutResult => {
  const cycleDuration =
    PROMPT_FADE_DURATION + timing.typingDuration + timing.fadeDuration + timing.commandDelay;
  const theme = createMockTheme();

  // Use reduce for immutable accumulation (functional approach)
  const result = commands.reduce<LayoutAccumulator>(
    (acc, cmd) => {
      const commandY = acc.currentY;
      const commandTime = acc.currentTime;

      // Timing for this command block:
      // 1. Prompt fades in
      // 2. Command types after prompt appears
      // 3. Output fades in after typing completes
      const cmdTiming: CommandTiming = {
        promptStart: commandTime,
        commandStart: commandTime + PROMPT_FADE_DURATION,
        outputStart:
          commandTime + PROMPT_FADE_DURATION + timing.typingDuration + timing.initialDelay,
      };

      // Calculate output height (this calls the renderer in pure way)
      // Output starts after prompt line + command line + gap
      const outputY = commandY + PROMPT_HEIGHT + COMMAND_LINE_HEIGHT + OUTPUT_GAP;
      const output = cmd.outputRenderer(theme, outputY);
      const blockHeight =
        PROMPT_HEIGHT + COMMAND_LINE_HEIGHT + OUTPUT_GAP + output.height + CONTENT_BOTTOM_GAP;
      const nextY = commandY + blockHeight;
      const nextHeight = acc.totalHeight + blockHeight;

      // Check if scroll is needed
      const scrollPoint: ScrollPoint | null =
        nextHeight > viewportHeight
          ? {
              time: commandTime + cycleDuration,
              distance: -(nextHeight - viewportHeight),
            }
          : null;

      return {
        positions: [...acc.positions, commandY],
        timings: [...acc.timings, cmdTiming],
        scrollPoints: scrollPoint ? [...acc.scrollPoints, scrollPoint] : acc.scrollPoints,
        currentY: nextY,
        currentTime: commandTime + cycleDuration,
        totalHeight: nextHeight,
      };
    },
    {
      positions: [],
      timings: [],
      scrollPoints: [],
      currentY: 0, // First prompt starts at top of scrollable content
      currentTime: timing.initialDelay,
      totalHeight: 0,
    },
  );

  // Return only public interface (omit accumulator internals)
  return {
    positions: result.positions,
    timings: result.timings,
    scrollPoints: result.scrollPoints,
    totalHeight: result.totalHeight,
  };
};
