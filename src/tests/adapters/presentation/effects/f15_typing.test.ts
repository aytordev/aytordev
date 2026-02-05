import { describe, expect, it } from "vitest";
import { wrapWithTyping } from "../../../../adapters/presentation/effects/typing";
import { TerminalRenderer } from "../../../../adapters/presentation/terminal-renderer";
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

  it("TerminalRenderer includes foreignObject for greeting", () => {
    const renderer = new TerminalRenderer();
    const svg = renderer.render(mockTerminalState);

    expect(svg).toContain("<foreignObject");
    expect(svg).toContain("animation: typing");
    expect(svg).toContain(mockTerminalState.greeting);
  });
});
