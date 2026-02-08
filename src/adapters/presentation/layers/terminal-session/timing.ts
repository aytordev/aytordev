import type { AnimationTiming } from "./types";

/**
 * Creates timing configuration based on animation speed.
 * Pure function.
 *
 * @param speed - Animation speed multiplier (0.5 = slow, 1 = normal, 2 = fast)
 * @returns Immutable timing configuration
 */
export const createAnimationTiming = (speed: number): AnimationTiming => ({
  typingDuration: 2 / speed,
  fadeDuration: 0.3 / speed,
  commandDelay: 0.5 / speed,
  initialDelay: 0.1,
});

/**
 * Calculates the total duration for a single command cycle.
 * Pure function.
 *
 * @param timing - Animation timing configuration
 * @returns Total duration in seconds
 */
export const calculateCommandCycleDuration = (timing: AnimationTiming): number =>
  timing.typingDuration + timing.fadeDuration + timing.commandDelay;
