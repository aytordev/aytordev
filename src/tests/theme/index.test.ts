import { describe, expect, it } from "vitest";
import { getTheme, registerTheme, themes } from "../../theme";
import { KanagawaTheme } from "../../theme/kanagawa";
import type { Theme } from "../../theme/types";

describe("Theme Registry", () => {
  it("should retrieve the default Kanagawa theme", () => {
    const theme = getTheme("kanagawa-wave");
    expect(theme.name).toBe("kanagawa-wave");
    expect(theme.colors.bg).toBe("#1F1F28");
  });

  it("should fallback to Kanagawa Wave if theme not found", () => {
    const theme = getTheme("non-existent-theme");
    expect(theme.name).toBe("kanagawa-wave");
  });

  it("should allow registering new themes", () => {
    const customTheme: Theme = {
      name: "custom-test",
      colors: { ...KanagawaTheme.colors, bg: "#000000" },
    };

    registerTheme(customTheme);
    const retrieved = getTheme("custom-test");
    expect(retrieved.name).toBe("custom-test");
    expect(retrieved.colors.bg).toBe("#000000");
  });

  it("should list available themes", () => {
    expect(themes["kanagawa-wave"]).toBeDefined();
  });
});
