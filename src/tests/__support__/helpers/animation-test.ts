/**
 * Helpers for testing animation-related functionality
 */

import { TEST_ANIMATION, TEST_TIMING } from "../constants";

export const animationTest = {
  /**
   * Calculate expected animation duration given speed
   */
  calculateTypingCharRate(speed: number): number {
    const BASE_TYPING_CHAR_RATE = TEST_TIMING.TYPING_CHAR_RATE;
    return BASE_TYPING_CHAR_RATE / speed;
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
