import { describe, expect, it } from "vitest";
import { createGlowFilter } from "../../rendering/effects/glow";
import { createSkillGradient } from "../../rendering/effects/gradients";

describe("Effects Module", () => {
  it("should generate linear gradient", () => {
    const gradient = createSkillGradient("test-grad", "#000", "#fff");
    expect(gradient).toContain('<linearGradient id="test-grad"');
    expect(gradient).toContain('stop-color="#000"');
    expect(gradient).toContain('stop-color="#fff"');
  });

  it("should generate glow filter", () => {
    const filter = createGlowFilter("test-glow");
    expect(filter).toContain('<filter id="test-glow"');
    expect(filter).toContain("feGaussianBlur");
    expect(filter).toContain("feMerge");
  });
});
