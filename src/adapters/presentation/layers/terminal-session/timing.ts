import type { AnimationTiming } from "./types";

/**
 * Creates timing configuration based on animation speed.
 * Pure function.
 *
 * @param speed - Animation speed multiplier (0.5 = slow, 1 = normal, 2 = fast)
 * @returns Immutable timing configuration
 */
export const createAnimationTiming = (speed: number): AnimationTiming => ({
  typingCharRate: 0.12 / speed,
  fadeDuration: 0.3 / speed,
  commandDelay: 0.5 / speed,
  initialDelay: 0.1,
});

/**
 * Calculates the typing duration for a command based on character count.
 * Pure function.
 *
 * @param charCount - Number of characters in the command text (including "$ " prefix)
 * @param timing - Animation timing configuration
 * @returns Typing duration in seconds
 */
export const calculateTypingDuration = (charCount: number, timing: AnimationTiming): number =>
  charCount * timing.typingCharRate;

/**
 * Calculates the total duration for a single command cycle.
 * Pure function.
 *
 * @param timing - Animation timing configuration
 * @param commandCharCount - Number of characters in the command text (including "$ " prefix)
 * @returns Total duration in seconds
 */
export const calculateCommandCycleDuration = (
  timing: AnimationTiming,
  commandCharCount: number,
): number => calculateTypingDuration(commandCharCount, timing) + timing.fadeDuration + timing.commandDelay;
