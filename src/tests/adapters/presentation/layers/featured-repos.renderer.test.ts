import { describe, expect, it } from "vitest";
import {
  renderFeaturedRepos,
  calculateFeaturedReposHeight,
} from "../../../../adapters/presentation/layers/featured-repos.renderer";
import type { FeaturedRepo } from "../../../../domain/value-objects/featured-repo";
import { createMockTheme } from "../../../mocks/theme";

const theme = createMockTheme();

const sampleRepos: ReadonlyArray<FeaturedRepo> = [
  {
    name: "terminal-profile",
    nameWithOwner: "aytordev/terminal-profile",
    description: "Generate beautiful terminal-style GitHub profiles",
    stargazerCount: 128,
    primaryLanguage: { name: "TypeScript", color: "#3178C6" },
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    name: "nix-config",
    nameWithOwner: "aytordev/nix-config",
    description: "My NixOS configuration",
    stargazerCount: 42,
    primaryLanguage: { name: "Nix", color: "#7E7EFF" },
    updatedAt: "2024-05-15T00:00:00Z",
  },
  {
    name: "rust-tools",
    nameWithOwner: "aytordev/rust-tools",
    stargazerCount: 7,
    primaryLanguage: { name: "Rust", color: "#DEA584" },
    updatedAt: "2024-04-01T00:00:00Z",
  },
];

describe("renderFeaturedRepos", () => {
  it("should return svg and height", () => {
    const result = renderFeaturedRepos(sampleRepos, theme);

    expect(typeof result.svg).toBe("string");
    expect(typeof result.height).toBe("number");
    expect(result.height).toBeGreaterThan(0);
  });

  it("should render repo names", () => {
    const result = renderFeaturedRepos(sampleRepos, theme);

    expect(result.svg).toContain("terminal-profile");
    expect(result.svg).toContain("nix-config");
    expect(result.svg).toContain("rust-tools");
  });

  it("should render star counts", () => {
    const result = renderFeaturedRepos(sampleRepos, theme);

    expect(result.svg).toContain("128");
    expect(result.svg).toContain("42");
  });

  it("should render descriptions when present", () => {
    const result = renderFeaturedRepos(sampleRepos, theme);

    expect(result.svg).toContain("Generate beautiful terminal-style GitHub profiles");
    expect(result.svg).toContain("My NixOS configuration");
  });

  it("should handle repos without description", () => {
    const repos: ReadonlyArray<FeaturedRepo> = [
      {
        name: "no-desc",
        nameWithOwner: "user/no-desc",
        stargazerCount: 1,
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ];
    const result = renderFeaturedRepos(repos, theme);

    expect(result.svg).toContain("no-desc");
  });

  it("should render language info when present", () => {
    const result = renderFeaturedRepos(sampleRepos, theme);

    expect(result.svg).toContain("TypeScript");
    expect(result.svg).toContain("#3178C6");
  });

  it("should return empty group for empty array", () => {
    const result = renderFeaturedRepos([], theme);

    expect(result.svg).toContain("featured-repos");
    expect(result.height).toBe(0);
  });

  it("should apply y offset", () => {
    const result = renderFeaturedRepos(sampleRepos, theme, 200);

    expect(result.svg).toContain('transform="translate(0, 200)"');
  });

  it("should be a pure function", () => {
    const result1 = renderFeaturedRepos(sampleRepos, theme);
    const result2 = renderFeaturedRepos(sampleRepos, theme);

    expect(result1.svg).toBe(result2.svg);
    expect(result1.height).toBe(result2.height);
  });

  it("should use theme colors", () => {
    const result = renderFeaturedRepos(sampleRepos, theme);

    expect(result.svg).toContain(theme.colors.springBlue);
    expect(result.svg).toContain(theme.colors.carpYellow);
    expect(result.svg).toContain(theme.colors.textSecondary);
  });
});

describe("calculateFeaturedReposHeight", () => {
  it("should return 0 for empty repos", () => {
    expect(calculateFeaturedReposHeight([])).toBe(0);
  });

  it("should increase with more repos", () => {
    const one = calculateFeaturedReposHeight(sampleRepos.slice(0, 1));
    const three = calculateFeaturedReposHeight(sampleRepos);

    expect(three).toBeGreaterThan(one);
  });

  it("should be a pure function", () => {
    expect(calculateFeaturedReposHeight(sampleRepos)).toBe(
      calculateFeaturedReposHeight(sampleRepos),
    );
  });

  it("should match renderFeaturedRepos height", () => {
    const calculated = calculateFeaturedReposHeight(sampleRepos);
    const rendered = renderFeaturedRepos(sampleRepos, theme);

    expect(calculated).toBe(rendered.height);
  });
});
