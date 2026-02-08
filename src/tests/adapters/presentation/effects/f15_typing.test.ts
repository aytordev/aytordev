import { describe, expect, it } from "vitest";
import { wrapWithTyping } from "../../../../adapters/presentation/effects/typing";
import { renderTerminal } from "../../../../adapters/presentation/terminal-renderer";
import { mockTerminalState } from "../../../mocks/terminal-state";

describe("F15 Typing Animation", () => {
  it("wrapWithTyping generates correct HTML/CSS", () => {
    const text = "Hello World";
    const wrapped = wrapWithTyping(text);

    expect(wrapped).toContain("animation: typing");
    expect(wrapped).toContain("width: 11ch");
    expect(wrapped).toContain("Hello World");
    expect(wrapped).toContain("border-right");
  });

  it("TerminalRenderer includes greeting text", () => {
    const svg = renderTerminal(mockTerminalState);

    // Note: foreignObject removed for GitHub compatibility (Commit 14)
    // Now uses native SVG text element
    expect(svg).toContain('id="greeting"');
    expect(svg).toContain(mockTerminalState.greeting);
  });
});
