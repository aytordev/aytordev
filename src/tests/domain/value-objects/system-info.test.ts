import { describe, expect, it } from "vitest";
import { createSystemInfo } from "../../../domain/value-objects/system-info";

describe("createSystemInfo", () => {
  const validData = {
    os: "NixOS",
    shell: "zsh",
    editor: "neovim",
    terminal: "ghostty",
    theme: "Kanagawa",
  };

  it("should create valid SystemInfo without wm", () => {
    const result = createSystemInfo(validData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.os).toBe("NixOS");
      expect(result.value.shell).toBe("zsh");
      expect(result.value.editor).toBe("neovim");
      expect(result.value.terminal).toBe("ghostty");
      expect(result.value.theme).toBe("Kanagawa");
      expect(result.value.wm).toBeUndefined();
    }
  });

  it("should create valid SystemInfo with wm", () => {
    const result = createSystemInfo({ ...validData, wm: "yabai" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.wm).toBe("yabai");
    }
  });

  it("should trim whitespace from all fields", () => {
    const result = createSystemInfo({
      os: "  NixOS  ",
      shell: "  zsh  ",
      editor: "  neovim  ",
      terminal: "  ghostty  ",
      theme: "  Kanagawa  ",
      wm: "  yabai  ",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.os).toBe("NixOS");
      expect(result.value.shell).toBe("zsh");
      expect(result.value.editor).toBe("neovim");
      expect(result.value.terminal).toBe("ghostty");
      expect(result.value.theme).toBe("Kanagawa");
      expect(result.value.wm).toBe("yabai");
    }
  });

  it("should reject empty os", () => {
    const result = createSystemInfo({ ...validData, os: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("os cannot be empty");
    }
  });

  it("should reject empty shell", () => {
    const result = createSystemInfo({ ...validData, shell: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("shell cannot be empty");
    }
  });

  it("should reject empty editor", () => {
    const result = createSystemInfo({ ...validData, editor: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("editor cannot be empty");
    }
  });

  it("should reject empty terminal", () => {
    const result = createSystemInfo({ ...validData, terminal: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("terminal cannot be empty");
    }
  });

  it("should reject empty theme", () => {
    const result = createSystemInfo({ ...validData, theme: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("theme cannot be empty");
    }
  });

  it("should reject empty wm string", () => {
    const result = createSystemInfo({ ...validData, wm: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("wm cannot be an empty string");
    }
  });

  it("should reject whitespace-only fields", () => {
    const result = createSystemInfo({ ...validData, os: "   " });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("os cannot be empty");
    }
  });
});
