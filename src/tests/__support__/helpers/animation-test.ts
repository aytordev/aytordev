/**
 * Helpers for testing animation-related functionality
 */

import { TEST_ANIMATION, TEST_TIMING } from "../constants";

export const animationTest = {
  /**
   * Calculate expected animation duration given speed
   */
  calculateTypingDuration(speed: number): number {
    const BASE_TYPING_DURATION = TEST_TIMING.TYPING_DURATION;
    return BASE_TYPING_DURATION / speed;
  },

  /**
   * Calculate expected fade duration given speed
   */
  calculateFadeDuration(speed: number): number {
    const BASE_FADE_DURATION = TEST_TIMING.FADE_DURATION;
    return BASE_FADE_DURATION / speed;
  },

  /**
   * Common animation speeds for testing
   */
  speeds: TEST_ANIMATION,

  /**
   * Common timing values
   */
  timing: TEST_TIMING,
};
