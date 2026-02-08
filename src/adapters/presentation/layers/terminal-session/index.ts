/**
 * Terminal Session Animation Module
 *
 * Pure functional module for animating terminal sessions with scroll simulation.
 * Follows strict functional programming principles: immutability, pure functions, composition.
 */

// Type exports
export type {
  AnimatedCommand,
  AnimationTiming,
  CommandTiming,
  LayoutResult,
  ScrollPoint,
  SectionRenderer,
} from "./types";

// Timing functions
export {
  calculateCommandCycleDuration,
  createAnimationTiming,
} from "./timing";

// Command sequence building
export { buildCommandSequence, estimateRenderHeight } from "./command-sequence";

// Layout calculation
export { calculateLayout } from "./layout";

// Scroll detection
export { generateAllScrollKeyframes, generateScrollKeyframe } from "./scroll";
