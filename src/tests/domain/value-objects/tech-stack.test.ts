import { describe, expect, it } from "vitest";
import { createTechStack, createTechStackCategory } from "../../../domain/value-objects/tech-stack";

describe("createTechStackCategory", () => {
  it("should create valid TechStackCategory", () => {
    const result = createTechStackCategory({
      name: "Languages",
      items: ["TypeScript", "JavaScript"],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Languages");
      expect(result.value.items).toHaveLength(2);
      expect(result.value.items[0]).toBe("TypeScript");
    }
  });

  it("should trim whitespace from fields", () => {
    const result = createTechStackCategory({
      name: "  Languages  ",
      items: ["  TypeScript  ", "  JavaScript  "],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Languages");
      expect(result.value.items[0]).toBe("TypeScript");
    }
  });

  it("should accept empty items array", () => {
    const result = createTechStackCategory({
      name: "Languages",
      items: [],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.items).toHaveLength(0);
    }
  });

  it("should reject empty category name", () => {
    const result = createTechStackCategory({
      name: "",
      items: ["TypeScript"],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("cannot be empty");
    }
  });

  it("should reject empty items in array", () => {
    const result = createTechStackCategory({
      name: "Languages",
      items: ["TypeScript", ""],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("cannot contain empty strings");
    }
  });
});

describe("createTechStack", () => {
  it("should create valid TechStack", () => {
    const result = createTechStack({
      categories: [
        {
          name: "Languages",
          items: ["TypeScript", "JavaScript"],
        },
        {
          name: "Frameworks",
          items: ["React", "Vue"],
        },
      ],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.categories).toHaveLength(2);
      expect(result.value.categories[0].name).toBe("Languages");
    }
  });

  it("should accept empty categories array", () => {
    const result = createTechStack({
      categories: [],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.categories).toHaveLength(0);
    }
  });
});
