import type { ScrollPoint } from "./types";

/**
 * Generates CSS keyframe for a scroll animation.
 * Pure function - string in, string out.
 *
 * @param scrollPoint - Scroll timing and distance
 * @param index - Index for unique keyframe name
 * @returns CSS @keyframes rule as string
 */
export const generateScrollKeyframe = (
  scrollPoint: ScrollPoint,
  index: number,
): string => `
@keyframes scroll-${index} {
  from { transform: translateY(0); }
  to { transform: translateY(${scrollPoint.distance}px); }
}`;

/**
 * Generates all scroll keyframes for a sequence.
 * Pure function - maps array.
 *
 * @param scrollPoints - Array of scroll points
 * @returns Combined CSS keyframes as string
 */
export const generateAllScrollKeyframes = (
  scrollPoints: ReadonlyArray<ScrollPoint>,
): string =>
  scrollPoints
    .map((point, i) => generateScrollKeyframe(point, i))
    .join("\n");
