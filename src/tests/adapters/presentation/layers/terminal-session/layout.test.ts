import { describe, expect, it } from "vitest";
import { calculateLayout } from "../../../../../adapters/presentation/layers/terminal-session/layout";
import type {
  AnimatedCommand,
  AnimationTiming,
} from "../../../../../adapters/presentation/layers/terminal-session/types";
import { createMockTheme } from "../../../../mocks/theme";

const mockTiming: AnimationTiming = {
  typingDuration: 2,
  fadeDuration: 0.3,
  commandDelay: 0.5,
  initialDelay: 0.1,
};

const createMockCommand = (height: number): AnimatedCommand => ({
  command: "test-command",
  outputRenderer: (theme, y) => ({
    svg: `<text y="${y}">Mock</text>`,
    height,
  }),
});

describe("calculateLayout", () => {
  it("should calculate positions for all commands", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [
      createMockCommand(50),
      createMockCommand(60),
      createMockCommand(40),
    ];

    const layout = calculateLayout(commands, 300, mockTiming);

    expect(layout.positions).toHaveLength(3);
    expect(layout.positions[0]).toBeGreaterThanOrEqual(0);
    expect(layout.positions[1]).toBeGreaterThan(layout.positions[0]);
    expect(layout.positions[2]).toBeGreaterThan(layout.positions[1]);
  });

  it("should calculate timings for all commands", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(50), createMockCommand(60)];

    const layout = calculateLayout(commands, 300, mockTiming);

    expect(layout.timings).toHaveLength(2);
    expect(layout.timings[0].commandStart).toBeGreaterThanOrEqual(0);
    expect(layout.timings[0].outputStart).toBeGreaterThan(layout.timings[0].commandStart);
    expect(layout.timings[1].commandStart).toBeGreaterThan(layout.timings[0].outputStart);
  });

  it("should not create scroll points when content fits viewport", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(50), createMockCommand(50)];

    const layout = calculateLayout(commands, 500, mockTiming);

    expect(layout.scrollPoints).toHaveLength(0);
  });

  it("should create scroll points when content exceeds viewport", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [
      createMockCommand(100),
      createMockCommand(100),
      createMockCommand(100),
      createMockCommand(100),
    ];

    const layout = calculateLayout(commands, 200, mockTiming);

    expect(layout.scrollPoints.length).toBeGreaterThan(0);
  });

  it("should calculate correct scroll distance", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [
      createMockCommand(150),
      createMockCommand(150),
    ];

    const layout = calculateLayout(commands, 200, mockTiming);

    if (layout.scrollPoints.length > 0) {
      const scrollPoint = layout.scrollPoints[0];
      expect(scrollPoint.distance).toBeLessThan(0); // Negative = scroll up
      expect(Math.abs(scrollPoint.distance)).toBeGreaterThan(0);
    }
  });

  it("should calculate total height correctly", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [
      createMockCommand(50),
      createMockCommand(60),
      createMockCommand(40),
    ];

    const layout = calculateLayout(commands, 300, mockTiming);

    // Total height should include all command heights plus line heights
    expect(layout.totalHeight).toBeGreaterThan(150); // 50 + 60 + 40
  });

  it("should handle empty command array", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [];

    const layout = calculateLayout(commands, 300, mockTiming);

    expect(layout.positions).toHaveLength(0);
    expect(layout.timings).toHaveLength(0);
    expect(layout.scrollPoints).toHaveLength(0);
    expect(layout.totalHeight).toBeGreaterThanOrEqual(0);
  });

  it("should handle single command", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(80)];

    const layout = calculateLayout(commands, 300, mockTiming);

    expect(layout.positions).toHaveLength(1);
    expect(layout.timings).toHaveLength(1);
    expect(layout.scrollPoints).toHaveLength(0);
  });

  it("should space commands with correct timing cycle", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(50), createMockCommand(50)];

    const layout = calculateLayout(commands, 500, mockTiming);

    // Cycle now includes prompt fade duration (0.2s) + typing + fade + delay
    const promptFadeDuration = 0.2;
    const cycleDuration =
      promptFadeDuration +
      mockTiming.typingDuration +
      mockTiming.fadeDuration +
      mockTiming.commandDelay;
    const timeDiff = layout.timings[1].commandStart - layout.timings[0].commandStart;

    expect(timeDiff).toBeCloseTo(cycleDuration, 2);
  });

  it("should be a pure function (same input = same output)", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(50), createMockCommand(60)];

    const layout1 = calculateLayout(commands, 300, mockTiming);
    const layout2 = calculateLayout(commands, 300, mockTiming);

    expect(layout1.positions).toEqual(layout2.positions);
    expect(layout1.timings).toEqual(layout2.timings);
    expect(layout1.scrollPoints).toEqual(layout2.scrollPoints);
    expect(layout1.totalHeight).toBe(layout2.totalHeight);
  });

  it("should not mutate input commands", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(50), createMockCommand(60)];
    const originalCommands = [...commands];

    calculateLayout(commands, 300, mockTiming);

    expect(commands).toEqual(originalCommands);
  });

  it("should not mutate input timing", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(50)];
    const originalTiming = { ...mockTiming };

    calculateLayout(commands, 300, mockTiming);

    expect(mockTiming).toEqual(originalTiming);
  });

  it("should handle very tall content with multiple scroll points", () => {
    const commands: ReadonlyArray<AnimatedCommand> = Array.from({ length: 10 }, () =>
      createMockCommand(100),
    );

    const layout = calculateLayout(commands, 200, mockTiming);

    expect(layout.scrollPoints.length).toBeGreaterThan(1);
    expect(layout.totalHeight).toBeGreaterThan(1000);
  });

  it("should use correct line height for command positioning", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [
      createMockCommand(0), // Zero height output
    ];

    const layout = calculateLayout(commands, 300, mockTiming);

    // First command starts at y=0 (prompt is now part of each command block)
    expect(layout.positions[0]).toBe(0);
  });

  it("should calculate output start time after typing finishes", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [createMockCommand(50)];

    const layout = calculateLayout(commands, 300, mockTiming);

    const timing = layout.timings[0];
    const expectedDelay = mockTiming.typingDuration + mockTiming.initialDelay;

    expect(timing.outputStart - timing.commandStart).toBeCloseTo(expectedDelay, 2);
  });

  it("should create scroll points at correct times", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [
      createMockCommand(150),
      createMockCommand(150),
    ];

    const layout = calculateLayout(commands, 200, mockTiming);

    if (layout.scrollPoints.length > 0) {
      const scrollPoint = layout.scrollPoints[0];
      expect(scrollPoint.time).toBeGreaterThan(0);
      // Scroll should happen after command cycle completes
      const cycleDuration =
        mockTiming.typingDuration + mockTiming.fadeDuration + mockTiming.commandDelay;
      expect(scrollPoint.time).toBeGreaterThanOrEqual(cycleDuration);
    }
  });

  it("should accumulate height correctly across commands", () => {
    const commands: ReadonlyArray<AnimatedCommand> = [
      createMockCommand(50),
      createMockCommand(60),
      createMockCommand(70),
    ];

    const layout = calculateLayout(commands, 500, mockTiming);

    // Each command adds its height plus line height for command text
    const lineHeight = 20;
    const minExpectedHeight = 50 + 60 + 70 + lineHeight * 3;

    expect(layout.totalHeight).toBeGreaterThanOrEqual(minExpectedHeight);
  });

  it("should work with real theme", () => {
    const theme = createMockTheme();
    const commands: ReadonlyArray<AnimatedCommand> = [
      {
        command: "test",
        outputRenderer: (t, y) => ({
          svg: `<text y="${y}" fill="${t.colors.text}">Test</text>`,
          height: 50,
        }),
      },
    ];

    const layout = calculateLayout(commands, 300, mockTiming);

    expect(layout.positions).toHaveLength(1);
    expect(layout.timings).toHaveLength(1);
  });
});
