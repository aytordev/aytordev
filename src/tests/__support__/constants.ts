/**
 * Centralized test constants to eliminate magic numbers
 * All values should be immutable (as const)
 */

/**
 * Standard terminal dimensions for testing
 */
export const TEST_DIMENSIONS = {
  DEFAULT: { width: 800, height: 400 },
  LARGE: { width: 1200, height: 600 },
  SMALL: { width: 600, height: 300 },
} as const;

/**
 * Viewport dimensions and offsets
 */
export const TEST_VIEWPORT = {
  Y_OFFSET: 24,
  HEIGHT: 352,
  TMUX_BAR_HEIGHT: 24,
  PROMPT_HEIGHT: 40,
  FOOTER_HEIGHT: 24,
} as const;

/**
 * Animation speed constants
 */
export const TEST_ANIMATION = {
  SPEED_SLOW: 0.5,
  SPEED_NORMAL: 1,
  SPEED_FAST: 2,
  SPEED_MIN: 0.1,
  SPEED_MAX: 5,
  INITIAL_DELAY: 0.5,
} as const;

/**
 * Animation timing constants
 */
export const TEST_TIMING = {
  TYPING_CHAR_RATE: 0.12,
  FADE_DURATION: 0.3,
  COMMAND_DELAY: 0.5,
  INITIAL_DELAY: 0.1,
} as const;

/**
 * Standard test dates (frozen for consistency)
 */
export const TEST_DATES = {
  DEFAULT: new Date("2024-01-15T12:00:00Z"),
  PAST: new Date("2024-01-01T00:00:00Z"),
  FUTURE: new Date("2024-12-31T23:59:59Z"),
} as const;
