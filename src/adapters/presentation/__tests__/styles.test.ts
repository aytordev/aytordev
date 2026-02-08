import { describe, expect, it } from "vitest";
import { generateAnimationCss, generateCss } from "../styles";
import { createMockTheme } from "../../../tests/mocks/theme";

describe("generateAnimationCss", () => {
  it("should generate CSS animation styles with default speed (1)", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain(":root");
    expect(css).toContain("--animation-speed: 1");
    expect(css).toContain("--typing-duration: 2s");
    expect(css).toContain("--fade-duration: 0.3s");
  });

  it("should scale timing durations based on speed", () => {
    const slowCss = generateAnimationCss(0.5);
    expect(slowCss).toContain("--typing-duration: 4s");
    expect(slowCss).toContain("--fade-duration: 0.6s");

    const fastCss = generateAnimationCss(2);
    expect(fastCss).toContain("--typing-duration: 1s");
    expect(fastCss).toContain("--fade-duration: 0.15s");
  });

  it("should contain typewriter keyframes", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain("@keyframes typewriter");
    expect(css).toContain("from { width: 0; }");
    expect(css).toContain("to { width: 100%; }");
  });

  it("should contain fadeIn keyframes", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain("@keyframes fadeIn");
    expect(css).toContain("from { opacity: 0; transform: translateY(5px); }");
    expect(css).toContain("to { opacity: 1; transform: translateY(0); }");
  });

  it("should contain command-line class with typewriter animation", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain(".command-line");
    expect(css).toContain("overflow: hidden");
    expect(css).toContain("white-space: nowrap");
    expect(css).toContain("width: 0");
    expect(css).toContain("display: inline-block");
  });

  it("should contain command-line.animate class with animation", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain(".command-line.animate");
    expect(css).toContain("animation: typewriter var(--typing-duration) steps(40) forwards");
  });

  it("should contain command-output class", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain(".command-output");
    expect(css).toContain("opacity: 0");
  });

  it("should contain command-output.animate class with fadeIn animation", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain(".command-output.animate");
    expect(css).toContain("animation: fadeIn var(--fade-duration) ease-out forwards");
  });

  it("should use monospace font family for command-line", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain("font-family: 'Monaspace Neon', 'JetBrains Mono', monospace");
  });

  it("should use font-size 14px for command-line", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain("font-size: 14px");
  });

  it("should be a pure function (same input = same output)", () => {
    const css1 = generateAnimationCss(1.5);
    const css2 = generateAnimationCss(1.5);

    expect(css1).toBe(css2);
  });

  it("should handle very slow speed (0.1)", () => {
    const css = generateAnimationCss(0.1);

    expect(css).toContain("--typing-duration: 20s");
    expect(css).toContain("--fade-duration: 3s");
  });

  it("should handle very fast speed (5)", () => {
    const css = generateAnimationCss(5);

    expect(css).toContain("--typing-duration: 0.4s");
    expect(css).toContain("--fade-duration: 0.06s");
  });
});

describe("generateCss with animation", () => {
  const theme = createMockTheme();

  it("should include animation styles when animationSpeed is provided", () => {
    const css = generateCss(theme, 1);

    expect(css).toContain("@keyframes typewriter");
    expect(css).toContain("@keyframes fadeIn");
    expect(css).toContain(".command-line");
    expect(css).toContain(".command-output");
  });

  it("should not include animation styles when animationSpeed is undefined", () => {
    const css = generateCss(theme);

    expect(css).not.toContain("@keyframes typewriter");
    expect(css).not.toContain("@keyframes fadeIn");
    expect(css).not.toContain(".command-line");
    expect(css).not.toContain(".command-output");
  });

  it("should still include base styles when animation is enabled", () => {
    const css = generateCss(theme, 1);

    expect(css).toContain(":root");
    expect(css).toContain("--bg:");
    expect(css).toContain(".cursor");
    expect(css).toContain("@keyframes blink"); // Existing animation
  });

  it("should include theme variables regardless of animation", () => {
    const cssWithAnimation = generateCss(theme, 1);
    const cssWithoutAnimation = generateCss(theme);

    expect(cssWithAnimation).toContain("--bg:");
    expect(cssWithAnimation).toContain("--text:");
    expect(cssWithoutAnimation).toContain("--bg:");
    expect(cssWithoutAnimation).toContain("--text:");
  });

  it("should pass correct speed to generateAnimationCss", () => {
    const css = generateCss(theme, 2);

    expect(css).toContain("--animation-speed: 2");
    expect(css).toContain("--typing-duration: 1s");
  });
});
