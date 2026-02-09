import { describe, expect, it } from "vitest";
import {
  calculateNeofetchHeight,
  renderNeofetch,
} from "../../../../adapters/presentation/layers/neofetch.renderer";
import type { NeofetchData } from "../../../../domain/entities/terminal-content";
import { createMockTheme } from "../../../mocks/theme";

const theme = createMockTheme();

const createData = (overrides?: Partial<NeofetchData>): NeofetchData => ({
  owner: {
    name: "Aytor Developer",
    username: "aytordev",
    tagline: "Full-Stack Developer",
    location: "Madrid, Spain",
  },
  system: {
    os: "NixOS",
    shell: "zsh",
    editor: "neovim",
    terminal: "ghostty",
    theme: "Kanagawa",
  },
  stats: {
    totalCommits: 1200,
    currentStreak: 42,
    publicRepos: 30,
  },
  ...overrides,
});

describe("renderNeofetch", () => {
  it("should return svg and height", () => {
    const result = renderNeofetch(createData(), theme);

    expect(typeof result.svg).toBe("string");
    expect(typeof result.height).toBe("number");
    expect(result.height).toBeGreaterThan(0);
  });

  it("should render ASCII art lines", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).toContain("neofetch");
    expect(result.svg).toContain("<text");
  });

  it("should render username with @ prefix", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).toContain("@aytordev");
  });

  it("should render tagline", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).toContain("Full-Stack Developer");
  });

  it("should render system info labels and values", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).toContain("OS");
    expect(result.svg).toContain("NixOS");
    expect(result.svg).toContain("Shell");
    expect(result.svg).toContain("zsh");
    expect(result.svg).toContain("Editor");
    expect(result.svg).toContain("neovim");
    expect(result.svg).toContain("Terminal");
    expect(result.svg).toContain("ghostty");
    expect(result.svg).toContain("Theme");
    expect(result.svg).toContain("Kanagawa");
  });

  it("should render stats", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).toContain("Commits");
    expect(result.svg).toContain("1200");
    expect(result.svg).toContain("Streak");
    expect(result.svg).toContain("42");
    expect(result.svg).toContain("Repos");
    expect(result.svg).toContain("30");
  });

  it("should render optional WM line when present", () => {
    const data = createData({
      system: {
        os: "NixOS",
        shell: "zsh",
        editor: "neovim",
        terminal: "ghostty",
        theme: "Kanagawa",
        wm: "Hyprland",
      },
    });
    const result = renderNeofetch(data, theme);

    expect(result.svg).toContain("WM");
    expect(result.svg).toContain("Hyprland");
  });

  it("should not render WM line when absent", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).not.toContain("WM");
  });

  it("should apply y offset via transform", () => {
    const result = renderNeofetch(createData(), theme, 50);

    expect(result.svg).toContain('transform="translate(0, 50)"');
  });

  it("should default y to 0", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).toContain('transform="translate(0, 0)"');
  });

  it("should be a pure function (same input = same output)", () => {
    const data = createData();
    const result1 = renderNeofetch(data, theme);
    const result2 = renderNeofetch(data, theme);

    expect(result1.svg).toBe(result2.svg);
    expect(result1.height).toBe(result2.height);
  });

  it("should sanitize special characters in SVG output", () => {
    const data = createData({
      owner: {
        name: "Test <User>",
        username: "test&user",
        tagline: 'A "great" developer',
        location: "Earth",
      },
    });
    const result = renderNeofetch(data, theme);

    expect(result.svg).not.toContain("<User>");
    expect(result.svg).toContain("&amp;");
  });

  it("should use theme colors for text rendering", () => {
    const result = renderNeofetch(createData(), theme);

    expect(result.svg).toContain(theme.colors.springBlue);
    expect(result.svg).toContain(theme.colors.text);
  });
});

describe("calculateNeofetchHeight", () => {
  it("should return positive height", () => {
    const height = calculateNeofetchHeight(createData());

    expect(height).toBeGreaterThan(0);
  });

  it("should be taller with WM field", () => {
    const withoutWm = calculateNeofetchHeight(createData());
    const withWm = calculateNeofetchHeight(
      createData({
        system: {
          os: "NixOS",
          shell: "zsh",
          editor: "neovim",
          terminal: "ghostty",
          theme: "Kanagawa",
          wm: "Hyprland",
        },
      }),
    );

    expect(withWm).toBeGreaterThan(withoutWm);
  });

  it("should be a pure function", () => {
    const data = createData();
    expect(calculateNeofetchHeight(data)).toBe(calculateNeofetchHeight(data));
  });

  it("should match renderNeofetch height", () => {
    const data = createData();
    const calculated = calculateNeofetchHeight(data);
    const rendered = renderNeofetch(data, theme);

    expect(calculated).toBe(rendered.height);
  });
});
