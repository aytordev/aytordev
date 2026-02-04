import { describe, expect, it } from "vitest";
import { KanagawaTheme } from "../../theme/kanagawa";

describe("Kanagawa Wave Theme", () => {
  it("should match the Visual Design specifications", () => {
    // Backgrounds
    expect(KanagawaTheme.colors.bg).toBe("#1F1F28");
    expect(KanagawaTheme.colors.bgDark).toBe("#16161D");

    // Text
    expect(KanagawaTheme.colors.text).toBe("#DCD7BA");
    expect(KanagawaTheme.colors.textMuted).toBe("#727169");

    // Palette Colors
    expect(KanagawaTheme.colors.fujiWhite).toBe("#DCD7BA");
    expect(KanagawaTheme.colors.springGreen).toBe("#98BB6C");
    expect(KanagawaTheme.colors.surimiOrange).toBe("#FFA066");
    expect(KanagawaTheme.colors.crystalBlue).toBe("#7E9CD8");
  });

  it("should have correct name", () => {
    expect(KanagawaTheme.name).toBe("kanagawa-wave");
  });

  it("should have all required color keys", () => {
    // Simple check to ensure object is fully populated
    expect(KanagawaTheme.colors.sumiInk0).toBeDefined();
    expect(KanagawaTheme.colors.waveRed).toBeDefined();
  });
});
