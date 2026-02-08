import { describe, expect, it } from "vitest";
import { renderAsciiArt } from "../../../../adapters/presentation/layers/ascii-art.renderer";
import { createMockTheme } from "../../../mocks/theme";

describe("renderAsciiArt", () => {
  it("should render single line ASCII art", () => {
    const art = "Hello World";
    const theme = createMockTheme();
    const result = renderAsciiArt(art, theme, 0);

    expect(result.svg).toContain("Hello World");
    expect(result.svg).toContain(`fill="${theme.colors.dragonBlue}"`);
    expect(result.svg).toContain('y="0"');
    expect(result.offset).toBe(34); // 1 * 14 + 20
  });

  it("should render multi-line ASCII art with correct offsets", () => {
    const art = "Line 1\nLine 2\nLine 3";
    const result = renderAsciiArt(art, createMockTheme(), 10);

    expect(result.svg).toContain("Line 1");
    expect(result.svg).toContain("Line 2");
    expect(result.svg).toContain("Line 3");
    expect(result.svg).toContain('y="10"'); // First line at yOffset
    expect(result.svg).toContain('y="24"'); // Second line at yOffset + 14
    expect(result.svg).toContain('y="38"'); // Third line at yOffset + 28
    expect(result.offset).toBe(62); // 3 * 14 + 20
  });

  it("should apply theme colors correctly", () => {
    const art = "Test";
    const result = renderAsciiArt(art, createMockTheme(), 0);

    expect(result.svg).toContain(`fill="${createMockTheme().colors.dragonBlue}"`);
    expect(result.svg).toContain('class="terminal-text"');
  });

  it("should handle empty string", () => {
    const art = "";
    const result = renderAsciiArt(art, createMockTheme(), 0);

    expect(result.svg).toContain("text");
    expect(result.offset).toBe(34); // 1 * 14 + 20 (split("") gives [""])
  });

  it("should preserve XML special characters in xml:space", () => {
    const art = "Code: <tag>";
    const result = renderAsciiArt(art, createMockTheme(), 0);

    expect(result.svg).toContain('xml:space="preserve"');
    // Note: sanitization is not applied within this function,
    // it should be handled at a higher level if needed
  });

  it("should calculate offset correctly for different line counts", () => {
    const oneLineResult = renderAsciiArt("A", createMockTheme(), 0);
    const twoLineResult = renderAsciiArt("A\nB", createMockTheme(), 0);
    const fiveLineResult = renderAsciiArt("A\nB\nC\nD\nE", createMockTheme(), 0);

    expect(oneLineResult.offset).toBe(34); // 1 * 14 + 20
    expect(twoLineResult.offset).toBe(48); // 2 * 14 + 20
    expect(fiveLineResult.offset).toBe(90); // 5 * 14 + 20
  });
});
