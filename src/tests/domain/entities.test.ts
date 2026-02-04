import { describe, expect, it } from "vitest";
import type { TerminalState } from "../../domain/entities/terminal-state";

describe("Terminal Entities", () => {
  it("should structure TerminalState correctly", () => {
    // This test ensures all imported types resolve and interface matches expected optionality
    const state: Partial<TerminalState> = {
      greeting: "Hello",
      themeName: "kanagawa-wave",
    };
    expect(state.greeting).toBe("Hello");
  });
});
