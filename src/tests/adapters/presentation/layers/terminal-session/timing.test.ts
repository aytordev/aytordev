import { describe, expect, it } from "vitest";
import {
  calculateCommandCycleDuration,
  calculateTypingDuration,
  createAnimationTiming,
} from "../../../../../adapters/presentation/layers/terminal-session/timing";
import { TEST_ANIMATION } from "../../../../__support__/constants";

describe("createAnimationTiming", () => {
  it("should create timing configuration with speed 1 (normal)", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);

    expect(timing.typingCharRate).toBe(0.12);
    expect(timing.fadeDuration).toBe(0.3);
    expect(timing.commandDelay).toBe(0.5);
    expect(timing.initialDelay).toBe(0.1);
  });

  it("should create timing configuration with speed 2 (fast)", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_FAST);

    expect(timing.typingCharRate).toBe(0.06); // 0.12 / 2
    expect(timing.fadeDuration).toBe(0.15); // 0.3 / 2
    expect(timing.commandDelay).toBe(0.25); // 0.5 / 2
    expect(timing.initialDelay).toBe(0.1); // constant
  });

  it("should create timing configuration with speed 0.5 (slow)", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_SLOW);

    expect(timing.typingCharRate).toBe(0.24); // 0.12 / 0.5
    expect(timing.fadeDuration).toBe(0.6); // 0.3 / 0.5
    expect(timing.commandDelay).toBe(1); // 0.5 / 0.5
    expect(timing.initialDelay).toBe(0.1); // constant
  });

  it("should return object with readonly properties (compile-time)", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);

    expect(timing).toHaveProperty("typingCharRate");
    expect(timing).toHaveProperty("fadeDuration");
    expect(timing).toHaveProperty("commandDelay");
    expect(timing).toHaveProperty("initialDelay");
  });

  it("should be a pure function (same input = same output)", () => {
    const timing1 = createAnimationTiming(1.5);
    const timing2 = createAnimationTiming(1.5);

    expect(timing1).toEqual(timing2);
  });

  it("should handle minimum speed (0.1)", () => {
    const timing = createAnimationTiming(0.1);

    expect(timing.typingCharRate).toBeCloseTo(1.2, 5); // 0.12 / 0.1
    expect(timing.fadeDuration).toBeCloseTo(3, 5); // 0.3 / 0.1
    expect(timing.commandDelay).toBeCloseTo(5, 5); // 0.5 / 0.1
  });

  it("should handle maximum speed (5)", () => {
    const timing = createAnimationTiming(5);

    expect(timing.typingCharRate).toBe(0.024); // 0.12 / 5
    expect(timing.fadeDuration).toBe(0.06); // 0.3 / 5
    expect(timing.commandDelay).toBe(0.1); // 0.5 / 5
  });
});

describe("calculateTypingDuration", () => {
  it("should scale linearly with character count", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);

    expect(calculateTypingDuration(10, timing)).toBeCloseTo(1.2, 5);
    expect(calculateTypingDuration(20, timing)).toBeCloseTo(2.4, 5);
  });

  it("should scale with speed", () => {
    const slow = createAnimationTiming(TEST_ANIMATION.SPEED_SLOW);
    const fast = createAnimationTiming(TEST_ANIMATION.SPEED_FAST);

    expect(calculateTypingDuration(10, slow)).toBeCloseTo(2.4, 5); // 10 * 0.24
    expect(calculateTypingDuration(10, fast)).toBeCloseTo(0.6, 5); // 10 * 0.06
  });

  it("should return 0 for empty command", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);

    expect(calculateTypingDuration(0, timing)).toBe(0);
  });

  it("should be a pure function", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);

    expect(calculateTypingDuration(15, timing)).toBe(calculateTypingDuration(15, timing));
  });
});

describe("calculateCommandCycleDuration", () => {
  it("should calculate total duration for a single command cycle", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);
    // "test-command" = 12 chars + 2 ("$ ") = 14 chars
    const cycleDuration = calculateCommandCycleDuration(timing, 14);

    // typingDuration (14 * 0.12 = 1.68) + fadeDuration (0.3) + commandDelay (0.5) = 2.48
    expect(cycleDuration).toBeCloseTo(2.48, 5);
  });

  it("should calculate correctly for speed 2 (fast)", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_FAST);
    const cycleDuration = calculateCommandCycleDuration(timing, 14);

    // 14 * 0.06 + 0.15 + 0.25 = 0.84 + 0.4 = 1.24
    expect(cycleDuration).toBeCloseTo(1.24, 5);
  });

  it("should calculate correctly for speed 0.5 (slow)", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_SLOW);
    const cycleDuration = calculateCommandCycleDuration(timing, 14);

    // 14 * 0.24 + 0.6 + 1 = 3.36 + 1.6 = 4.96
    expect(cycleDuration).toBeCloseTo(4.96, 5);
  });

  it("should scale with command length", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);

    const shortCycle = calculateCommandCycleDuration(timing, 10);
    const longCycle = calculateCommandCycleDuration(timing, 40);

    expect(longCycle).toBeGreaterThan(shortCycle);
    // Difference should be (40 - 10) * 0.12 = 3.6
    expect(longCycle - shortCycle).toBeCloseTo(3.6, 5);
  });

  it("should be a pure function", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);
    const duration1 = calculateCommandCycleDuration(timing, 14);
    const duration2 = calculateCommandCycleDuration(timing, 14);

    expect(duration1).toBe(duration2);
  });

  it("should not mutate input timing object", () => {
    const timing = createAnimationTiming(TEST_ANIMATION.SPEED_NORMAL);
    const originalTiming = { ...timing };

    calculateCommandCycleDuration(timing, 14);

    expect(timing).toEqual(originalTiming);
  });
});
