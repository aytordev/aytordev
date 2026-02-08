import type { Theme } from "../../../../theme/types";

/**
 * Layout constants for terminal session rendering.
 * Centralized to ensure consistency across layout and rendering.
 */
export const PROMPT_HEIGHT = 20 as const; // Line 1: directory/git info
export const COMMAND_LINE_HEIGHT = 20 as const; // Line 2: command with typing animation
export const OUTPUT_GAP = 10 as const; // Gap between command and output
export const PROMPT_FADE_DURATION = 0.2 as const; // Duration for prompt fade-in before typing

/**
 * Represents a command with its associated section renderer.
 * Immutable value object.
 */
export interface AnimatedCommand {
  readonly command: string;
  readonly outputRenderer: SectionRenderer;
}

/**
 * Function signature for rendering a section.
 * Pure function: (theme, y) => (svg, height)
 */
export type SectionRenderer = (
  theme: Theme,
  y: number,
) => Readonly<{ svg: string; height: number }>;

/**
 * Timing configuration for animations.
 * Derived from AnimationConfig.speed.
 */
export interface AnimationTiming {
  readonly typingDuration: number;
  readonly fadeDuration: number;
  readonly commandDelay: number;
  readonly initialDelay: number;
}

/**
 * Timing information for a single command.
 */
export interface CommandTiming {
  readonly promptStart: number;
  readonly commandStart: number;
  readonly outputStart: number;
}

/**
 * Scroll animation point.
 */
export interface ScrollPoint {
  readonly time: number;
  readonly distance: number;
}

/**
 * Layout calculation result.
 * Contains positions and timings for all commands.
 */
export interface LayoutResult {
  readonly positions: ReadonlyArray<number>;
  readonly timings: ReadonlyArray<CommandTiming>;
  readonly scrollPoints: ReadonlyArray<ScrollPoint>;
  readonly totalHeight: number;
}
