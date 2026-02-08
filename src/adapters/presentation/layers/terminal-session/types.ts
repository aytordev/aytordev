import type { Theme } from "../../../../theme/types";

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
