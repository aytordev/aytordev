import { createMockTheme } from "../../../../tests/mocks/theme";
import type {
  AnimatedCommand,
  AnimationTiming,
  CommandTiming,
  LayoutResult,
  ScrollPoint,
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
  const cycleDuration = timing.typingDuration + timing.fadeDuration + timing.commandDelay;
  const lineHeight = 20;
  const theme = createMockTheme();

  // Use reduce for immutable accumulation (functional approach)
  const result = commands.reduce<LayoutAccumulator>(
    (acc, cmd) => {
      const commandY = acc.currentY;
      const commandTime = acc.currentTime;

      // Timing for this command
      const cmdTiming: CommandTiming = {
        commandStart: commandTime,
        outputStart: commandTime + timing.typingDuration + timing.initialDelay,
      };

      // Calculate output height (this calls the renderer in pure way)
      const output = cmd.outputRenderer(theme, commandY + lineHeight);
      const nextY = commandY + lineHeight + output.height;
      const nextHeight = acc.totalHeight + lineHeight + output.height;

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
        scrollPoints: scrollPoint
          ? [...acc.scrollPoints, scrollPoint]
          : acc.scrollPoints,
        currentY: nextY,
        currentTime: commandTime + cycleDuration,
        totalHeight: nextHeight,
      };
    },
    {
      positions: [],
      timings: [],
      scrollPoints: [],
      currentY: lineHeight, // Start after initial prompt
      currentTime: timing.initialDelay,
      totalHeight: lineHeight,
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
