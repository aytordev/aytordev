import { describe, expect, it } from "vitest";
import { createFeaturedRepo } from "../../../domain/value-objects/featured-repo";

describe("createFeaturedRepo", () => {
  const validData = {
    name: "my-project",
    nameWithOwner: "user/my-project",
    description: "A cool project",
    stargazerCount: 42,
    primaryLanguage: { name: "TypeScript", color: "#3178C6" },
    updatedAt: "2024-01-15T10:00:00Z",
  };

  it("should create valid FeaturedRepo with all fields", () => {
    const result = createFeaturedRepo(validData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("my-project");
      expect(result.value.nameWithOwner).toBe("user/my-project");
      expect(result.value.description).toBe("A cool project");
      expect(result.value.stargazerCount).toBe(42);
      expect(result.value.primaryLanguage).toEqual({ name: "TypeScript", color: "#3178C6" });
      expect(result.value.updatedAt).toBe("2024-01-15T10:00:00Z");
    }
  });

  it("should create valid FeaturedRepo without description", () => {
    const result = createFeaturedRepo({ ...validData, description: undefined });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.description).toBeUndefined();
    }
  });

  it("should create valid FeaturedRepo without primaryLanguage", () => {
    const result = createFeaturedRepo({ ...validData, primaryLanguage: undefined });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.primaryLanguage).toBeUndefined();
    }
  });

  it("should trim whitespace from name", () => {
    const result = createFeaturedRepo({ ...validData, name: "  my-project  " });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("my-project");
    }
  });

  it("should trim whitespace from description", () => {
    const result = createFeaturedRepo({ ...validData, description: "  A cool project  " });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.description).toBe("A cool project");
    }
  });

  it("should reject empty name", () => {
    const result = createFeaturedRepo({ ...validData, name: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("name cannot be empty");
    }
  });

  it("should reject empty nameWithOwner", () => {
    const result = createFeaturedRepo({ ...validData, nameWithOwner: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("nameWithOwner cannot be empty");
    }
  });

  it("should reject negative stargazerCount", () => {
    const result = createFeaturedRepo({ ...validData, stargazerCount: -1 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("stargazerCount cannot be negative");
    }
  });

  it("should accept zero stargazerCount", () => {
    const result = createFeaturedRepo({ ...validData, stargazerCount: 0 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.stargazerCount).toBe(0);
    }
  });

  it("should produce immutable value object", () => {
    const result = createFeaturedRepo(validData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("my-project");
      expect(result.value.stargazerCount).toBe(42);
    }
  });
});
