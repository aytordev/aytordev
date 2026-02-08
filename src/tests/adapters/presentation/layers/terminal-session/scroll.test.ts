import { describe, expect, it } from "vitest";
import { generateAllScrollKeyframes, generateScrollKeyframe } from "../../../../../adapters/presentation/layers/terminal-session/scroll";
import type { ScrollPoint } from "../../../../../adapters/presentation/layers/terminal-session/types";

describe("generateScrollKeyframe", () => {
  it("should generate CSS keyframe for a scroll animation", () => {
    const scrollPoint: ScrollPoint = {
      time: 5.0,
      distance: -100,
    };

    const keyframe = generateScrollKeyframe(scrollPoint, 0);

    expect(keyframe).toContain("@keyframes scroll-0");
    expect(keyframe).toContain("from { transform: translateY(0); }");
    expect(keyframe).toContain("to { transform: translateY(-100px); }");
  });

  it("should generate unique keyframe names based on index", () => {
    const scrollPoint: ScrollPoint = {
      time: 3.0,
      distance: -50,
    };

    const keyframe1 = generateScrollKeyframe(scrollPoint, 0);
    const keyframe2 = generateScrollKeyframe(scrollPoint, 1);
    const keyframe3 = generateScrollKeyframe(scrollPoint, 5);

    expect(keyframe1).toContain("@keyframes scroll-0");
    expect(keyframe2).toContain("@keyframes scroll-1");
    expect(keyframe3).toContain("@keyframes scroll-5");
  });

  it("should handle positive distance values", () => {
    const scrollPoint: ScrollPoint = {
      time: 2.0,
      distance: 75,
    };

    const keyframe = generateScrollKeyframe(scrollPoint, 0);

    expect(keyframe).toContain("to { transform: translateY(75px); }");
  });

  it("should handle zero distance", () => {
    const scrollPoint: ScrollPoint = {
      time: 1.0,
      distance: 0,
    };

    const keyframe = generateScrollKeyframe(scrollPoint, 0);

    expect(keyframe).toContain("to { transform: translateY(0px); }");
  });

  it("should be a pure function (same input = same output)", () => {
    const scrollPoint: ScrollPoint = {
      time: 4.0,
      distance: -200,
    };

    const keyframe1 = generateScrollKeyframe(scrollPoint, 2);
    const keyframe2 = generateScrollKeyframe(scrollPoint, 2);

    expect(keyframe1).toBe(keyframe2);
  });

  it("should not mutate input scroll point", () => {
    const scrollPoint: ScrollPoint = {
      time: 3.5,
      distance: -150,
    };
    const originalScrollPoint = { ...scrollPoint };

    generateScrollKeyframe(scrollPoint, 0);

    expect(scrollPoint).toEqual(originalScrollPoint);
  });
});

describe("generateAllScrollKeyframes", () => {
  it("should generate keyframes for all scroll points", () => {
    const scrollPoints: ReadonlyArray<ScrollPoint> = [
      { time: 2.0, distance: -50 },
      { time: 4.0, distance: -100 },
      { time: 6.0, distance: -150 },
    ];

    const keyframes = generateAllScrollKeyframes(scrollPoints);

    expect(keyframes).toContain("@keyframes scroll-0");
    expect(keyframes).toContain("@keyframes scroll-1");
    expect(keyframes).toContain("@keyframes scroll-2");
    expect(keyframes).toContain("translateY(-50px)");
    expect(keyframes).toContain("translateY(-100px)");
    expect(keyframes).toContain("translateY(-150px)");
  });

  it("should return empty string for empty array", () => {
    const scrollPoints: ReadonlyArray<ScrollPoint> = [];

    const keyframes = generateAllScrollKeyframes(scrollPoints);

    expect(keyframes).toBe("");
  });

  it("should handle single scroll point", () => {
    const scrollPoints: ReadonlyArray<ScrollPoint> = [{ time: 5.0, distance: -200 }];

    const keyframes = generateAllScrollKeyframes(scrollPoints);

    expect(keyframes).toContain("@keyframes scroll-0");
    expect(keyframes).toContain("translateY(-200px)");
    expect(keyframes).not.toContain("scroll-1");
  });

  it("should join keyframes with newlines", () => {
    const scrollPoints: ReadonlyArray<ScrollPoint> = [
      { time: 1.0, distance: -10 },
      { time: 2.0, distance: -20 },
    ];

    const keyframes = generateAllScrollKeyframes(scrollPoints);

    // Should contain at least one newline between keyframes
    expect(keyframes.split("\n").length).toBeGreaterThan(2);
  });

  it("should be a pure function", () => {
    const scrollPoints: ReadonlyArray<ScrollPoint> = [
      { time: 3.0, distance: -75 },
      { time: 6.0, distance: -125 },
    ];

    const keyframes1 = generateAllScrollKeyframes(scrollPoints);
    const keyframes2 = generateAllScrollKeyframes(scrollPoints);

    expect(keyframes1).toBe(keyframes2);
  });

  it("should not mutate input array", () => {
    const scrollPoints: ReadonlyArray<ScrollPoint> = [
      { time: 2.0, distance: -50 },
      { time: 4.0, distance: -100 },
    ];
    const originalScrollPoints = [...scrollPoints];

    generateAllScrollKeyframes(scrollPoints);

    expect(scrollPoints).toEqual(originalScrollPoints);
  });

  it("should maintain order of keyframes", () => {
    const scrollPoints: ReadonlyArray<ScrollPoint> = [
      { time: 1.0, distance: -25 },
      { time: 2.0, distance: -50 },
      { time: 3.0, distance: -75 },
    ];

    const keyframes = generateAllScrollKeyframes(scrollPoints);

    const scroll0Index = keyframes.indexOf("scroll-0");
    const scroll1Index = keyframes.indexOf("scroll-1");
    const scroll2Index = keyframes.indexOf("scroll-2");

    expect(scroll0Index).toBeLessThan(scroll1Index);
    expect(scroll1Index).toBeLessThan(scroll2Index);
  });
});
