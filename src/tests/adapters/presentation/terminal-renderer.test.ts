import { describe, expect, it } from "vitest";
import { renderTerminal } from "../../../adapters/presentation/terminal-renderer";
import { terminalStateBuilder } from "../../__support__/builders";
import { TEST_ANIMATION, TEST_DIMENSIONS } from "../../__support__/constants";

describe("Terminal Renderer Orchestrator", () => {
  const mockState = terminalStateBuilder().build();

  it("should generate complete SVG", () => {
    const svg = renderTerminal(mockState);

    expect(svg).toContain("<svg");
    expect(svg).toContain("#1F1F28"); // Kanagawa Wave BG
    expect(svg).toContain('id="tmux-bar"');
    expect(svg).toContain('id="prompt"');
    expect(svg).toContain('id="neofetch"');
  });

  it("should respect custom dimensions", () => {
    const customState = terminalStateBuilder()
      .withDimensions(TEST_DIMENSIONS.LARGE.width, TEST_DIMENSIONS.LARGE.height)
      .build();
    const svg = renderTerminal(customState);

    expect(svg).toContain('viewBox="0 0 1200 600"');
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="600"');
  });

  describe("Strategy Pattern - Animation Mode Selection", () => {
    it("should use static renderer when animation is undefined", () => {
      const svg = renderTerminal(mockState);

      expect(svg).toContain('id="prompt"');
      expect(svg).toContain('id="neofetch"');
      expect(svg).not.toContain("clipPath");
      expect(svg).not.toContain("terminal-viewport");
      expect(svg).not.toContain("scrollable-content");
    });

    it("should use static renderer when animation.enabled is false", () => {
      const stateWithAnimationDisabled = terminalStateBuilder()
        .withAnimation({
          enabled: false,
          speed: TEST_ANIMATION.SPEED_NORMAL,
          initialDelay: 0.5,
        })
        .build();
      const svg = renderTerminal(stateWithAnimationDisabled);

      expect(svg).toContain('id="prompt"');
      expect(svg).not.toContain("clipPath");
      expect(svg).not.toContain("terminal-viewport");
    });

    it("should use animated renderer when animation.enabled is true", () => {
      const stateWithAnimationEnabled = terminalStateBuilder()
        .withAnimation({
          enabled: true,
          speed: TEST_ANIMATION.SPEED_NORMAL,
          initialDelay: 0.5,
        })
        .build();
      const svg = renderTerminal(stateWithAnimationEnabled);

      expect(svg).toContain("clipPath");
      expect(svg).toContain('id="terminal-viewport"');
      expect(svg).toContain('id="scrollable-content"');
      expect(svg).toContain("neofetch");
    });

    it("should include CSS reveal and SMIL typing when in animated mode", () => {
      const stateWithAnimation = terminalStateBuilder()
        .withAnimation({
          enabled: true,
          speed: TEST_ANIMATION.SPEED_NORMAL,
          initialDelay: 0.5,
        })
        .build();
      const svg = renderTerminal(stateWithAnimation);

      expect(svg).toContain('class="command-0 command-line terminal-text"');
      // CSS handles progressive reveal (animation-fill-mode: both)
      expect(svg).toContain("@keyframes reveal");
      expect(svg).toContain('class="prompt-0"');
      expect(svg).toContain('class="output-0"');
      expect(svg).toContain(".command-0 { animation: reveal");
      // SMIL handles typing animation
      expect(svg).toContain("begin=");
    });

    it("should pass animation speed to animated renderer", () => {
      const stateWithFastAnimation = terminalStateBuilder()
        .withAnimation({
          enabled: true,
          speed: TEST_ANIMATION.SPEED_FAST,
          initialDelay: 0.1,
        })
        .build();
      const svg = renderTerminal(stateWithFastAnimation);

      // SMIL uses begin= for timing instead of animation-delay
      expect(svg).toContain("begin=");
    });

    it("should maintain backward compatibility - static mode unchanged", () => {
      const svgWithoutAnimation = renderTerminal(mockState);
      const svgWithAnimationDisabled = renderTerminal(
        terminalStateBuilder()
          .withAnimation({ enabled: false, speed: TEST_ANIMATION.SPEED_NORMAL, initialDelay: 0 })
          .build(),
      );

      expect(svgWithoutAnimation).toContain('id="tmux-bar"');
      expect(svgWithAnimationDisabled).toContain('id="tmux-bar"');
      expect(svgWithoutAnimation).toContain('id="prompt"');
      expect(svgWithAnimationDisabled).toContain('id="prompt"');
    });
  });
});
