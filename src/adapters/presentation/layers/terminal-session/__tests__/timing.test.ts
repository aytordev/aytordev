import { describe, expect, it } from "vitest";
import { calculateCommandCycleDuration, createAnimationTiming } from "../timing";

describe("createAnimationTiming", () => {
  it("should create timing configuration with speed 1 (normal)", () => {
    const timing = createAnimationTiming(1);

    expect(timing.typingDuration).toBe(2);
    expect(timing.fadeDuration).toBe(0.3);
    expect(timing.commandDelay).toBe(0.5);
    expect(timing.initialDelay).toBe(0.1);
  });

  it("should create timing configuration with speed 2 (fast)", () => {
    const timing = createAnimationTiming(2);

    expect(timing.typingDuration).toBe(1); // 2 / 2
    expect(timing.fadeDuration).toBe(0.15); // 0.3 / 2
    expect(timing.commandDelay).toBe(0.25); // 0.5 / 2
    expect(timing.initialDelay).toBe(0.1); // constant
  });

  it("should create timing configuration with speed 0.5 (slow)", () => {
    const timing = createAnimationTiming(0.5);

    expect(timing.typingDuration).toBe(4); // 2 / 0.5
    expect(timing.fadeDuration).toBe(0.6); // 0.3 / 0.5
    expect(timing.commandDelay).toBe(1); // 0.5 / 0.5
    expect(timing.initialDelay).toBe(0.1); // constant
  });

  it("should return object with readonly properties (compile-time)", () => {
    const timing = createAnimationTiming(1);

    // TypeScript ensures readonly at compile time
    // Verify all properties are present
    expect(timing).toHaveProperty("typingDuration");
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

    expect(timing.typingDuration).toBeCloseTo(20, 5); // 2 / 0.1
    expect(timing.fadeDuration).toBeCloseTo(3, 5); // 0.3 / 0.1
    expect(timing.commandDelay).toBeCloseTo(5, 5); // 0.5 / 0.1
  });

  it("should handle maximum speed (5)", () => {
    const timing = createAnimationTiming(5);

    expect(timing.typingDuration).toBe(0.4); // 2 / 5
    expect(timing.fadeDuration).toBe(0.06); // 0.3 / 5
    expect(timing.commandDelay).toBe(0.1); // 0.5 / 5
  });
});

describe("calculateCommandCycleDuration", () => {
  it("should calculate total duration for a single command cycle", () => {
    const timing = createAnimationTiming(1);
    const cycleDuration = calculateCommandCycleDuration(timing);

    // typingDuration (2) + fadeDuration (0.3) + commandDelay (0.5) = 2.8
    expect(cycleDuration).toBe(2.8);
  });

  it("should calculate correctly for speed 2 (fast)", () => {
    const timing = createAnimationTiming(2);
    const cycleDuration = calculateCommandCycleDuration(timing);

    // 1 + 0.15 + 0.25 = 1.4
    expect(cycleDuration).toBe(1.4);
  });

  it("should calculate correctly for speed 0.5 (slow)", () => {
    const timing = createAnimationTiming(0.5);
    const cycleDuration = calculateCommandCycleDuration(timing);

    // 4 + 0.6 + 1 = 5.6
    expect(cycleDuration).toBe(5.6);
  });

  it("should be a pure function", () => {
    const timing = createAnimationTiming(1);
    const duration1 = calculateCommandCycleDuration(timing);
    const duration2 = calculateCommandCycleDuration(timing);

    expect(duration1).toBe(duration2);
  });

  it("should not mutate input timing object", () => {
    const timing = createAnimationTiming(1);
    const originalTiming = { ...timing };

    calculateCommandCycleDuration(timing);

    expect(timing).toEqual(originalTiming);
  });
});
