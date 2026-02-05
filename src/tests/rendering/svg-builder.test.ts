import { describe, expect, it } from "vitest";
import { SvgBuilder } from "../../rendering/svg-builder";
import { KanagawaTheme } from "../../theme/kanagawa";

describe("SvgBuilder", () => {
  it("should create a basic SVG structure", () => {
    const builder = new SvgBuilder(KanagawaTheme, { width: 800, height: 400 });
    const svg = builder.build();

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 800 400"');
    expect(svg).toContain(`width="800"`);
  });

  it("should include styles", () => {
    const builder = new SvgBuilder(KanagawaTheme, { width: 800, height: 400 });
    const svg = builder.build();

    expect(svg).toContain("<style>");
    expect(svg).toContain(`--bg: ${KanagawaTheme.colors.bg}`);
  });

  it("should support accessibility tags", () => {
    const builder = new SvgBuilder(KanagawaTheme, { width: 800, height: 400 });
    const svg = builder.build();

    expect(svg).toContain("<title>Terminal Profile</title>");
    expect(svg).toContain(
      "<desc>Developer terminal profile generated with terminal-profile</desc>",
    );
  });

  it("should sanitize content", () => {
    // SvgBuilder should escape/sanitize content added to it (testing via method we'll add now)
    const builder = new SvgBuilder(KanagawaTheme, { width: 800, height: 400 });
    const result = builder.sanitize("<div>unsafe</div>");
    expect(result).toBe("&lt;div&gt;unsafe&lt;/div&gt;");
  });

  it("should valid SVG with defs", () => {
    const builder = new SvgBuilder(KanagawaTheme, {
      width: 100,
      height: 100,
    });
    builder.addDefs('<linearGradient id="grad"></linearGradient>');
    const svg = builder.build();
    expect(svg).toContain("<defs>");
    expect(svg).toContain("grad");
    expect(svg).toContain("</defs>");
  });
});
