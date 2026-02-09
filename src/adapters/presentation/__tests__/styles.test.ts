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

  it("should not contain typewriter keyframes (uses SVG clipPath instead)", () => {
    const css = generateAnimationCss(1);

    // Typewriter animation is now handled via SVG clipPath, not CSS
    expect(css).not.toContain("@keyframes typewriter");
  });

  it("should contain fadeIn keyframes (opacity only)", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain("@keyframes fadeIn");
    expect(css).toContain("from { opacity: 0; }");
    expect(css).toContain("to { opacity: 1; }");
  });

  it("should contain command-line class with font styling (no layout props)", () => {
    const css = generateAnimationCss(1);

    // Command-line now only has font styling; animation via SVG clipPath
    expect(css).toContain(".command-line");
    expect(css).toContain("font-family:");
    expect(css).toContain("font-size: 14px");
  });

  it("should not contain command-line.animate class (uses SVG animation)", () => {
    const css = generateAnimationCss(1);

    // .command-line.animate no longer exists; animation via SVG
    expect(css).not.toContain(".command-line.animate");
  });

  it("should contain command-output class", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain(".command-output");
    expect(css).toContain("opacity: 0");
  });

  it("should contain command-output.animate class with fadeInOutput animation", () => {
    const css = generateAnimationCss(1);

    expect(css).toContain(".command-output.animate");
    // Uses fadeInOutput to preserve SVG transforms
    expect(css).toContain("animation: fadeInOutput var(--fade-duration) ease-out forwards");
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

    // No typewriter keyframes (uses SVG), but has fadeIn and classes
    expect(css).not.toContain("@keyframes typewriter");
    expect(css).toContain("@keyframes fadeIn");
    expect(css).toContain(".command-line");
    expect(css).toContain(".command-output");
  });

  it("should not include animation styles when animationSpeed is undefined", () => {
    const css = generateCss(theme);

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
