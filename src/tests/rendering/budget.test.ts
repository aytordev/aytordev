import { describe, expect, it } from "vitest";
import { validateBudget } from "../../rendering/budget";

describe("Budget Validator", () => {
  it("should pass for small valid SVG", () => {
    const svg = "<svg><g><text>Hello</text></g></svg>";
    const result = validateBudget(svg);
    expect(result.ok).toBe(true);
  });

  it("should fail if file size exceeds limit (80KB)", () => {
    // Generate large content
    const hugeContent = "a".repeat(80001);
    const svg = `<svg>${hugeContent}</svg>`;
    const result = validateBudget(svg);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.metric).toBe("SVG size (bytes)");
    }
  });

  it("should fail if element count exceeds limit (400)", () => {
    const elements = "<g></g>".repeat(401);
    const svg = `<svg>${elements}</svg>`;
    const result = validateBudget(svg);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.metric).toBe("Element count");
    }
  });

  it("should fail if animation count exceeds limit (5)", () => {
    const animations = "@keyframes a{}".repeat(6);
    const svg = `<svg><style>${animations}</style></svg>`;
    const result = validateBudget(svg);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.metric).toBe("Animation count");
    }
  });
});
