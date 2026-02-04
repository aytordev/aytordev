import { describe, expect, it } from "vitest";
import { generateCss, generateVariables } from "../../rendering/styles";
import { KanagawaTheme } from "../../theme/kanagawa";

describe("CSS Generation", () => {
  it("should generate CSS variables from theme", () => {
    const css = generateVariables(KanagawaTheme);
    expect(css).toContain(":root {");
    expect(css).toContain(`--bg: ${KanagawaTheme.colors.bg};`);
    expect(css).toContain(`--text: ${KanagawaTheme.colors.text};`);
    expect(css).toContain("}");
  });

  it("should generate base styles including cursor animation", () => {
    const css = generateCss(KanagawaTheme);
    expect(css).toContain(".background {");
    expect(css).toContain("fill: var(--bg);");
    expect(css).toContain("@keyframes blink");
  });

  it("should include BEM strict classes", () => {
    const css = generateCss(KanagawaTheme);
    expect(css).toContain(".tmux__bg {");
    expect(css).toContain(".prompt__dir {");
    expect(css).toContain(".dev__username {");
    expect(css).toContain(".commit__msg {");
  });
});
