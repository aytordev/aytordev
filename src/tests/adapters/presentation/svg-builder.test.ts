import { describe, expect, it } from "vitest";
import {
  addDefs,
  addLayer,
  build,
  createSvgBuilder,
  pipe,
  sanitize,
} from "../../../adapters/presentation/svg-builder";
import { KanagawaTheme } from "../../../theme/kanagawa";
import { TEST_DIMENSIONS } from "../../__support__/constants";

describe("SvgBuilder", () => {
  it("should create a basic SVG structure", () => {
    const state = createSvgBuilder(KanagawaTheme, TEST_DIMENSIONS.DEFAULT);
    const svg = build(state);

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 800 400"');
    expect(svg).toContain(`width="800"`);
  });

  it("should include styles", () => {
    const state = createSvgBuilder(KanagawaTheme, TEST_DIMENSIONS.DEFAULT);
    const svg = build(state);

    expect(svg).toContain("<style>");
    expect(svg).toContain(`--bg: ${KanagawaTheme.colors.bg}`);
  });

  it("should support accessibility tags", () => {
    const state = createSvgBuilder(KanagawaTheme, TEST_DIMENSIONS.DEFAULT);
    const svg = build(state);

    expect(svg).toContain("<title>Terminal Profile</title>");
    expect(svg).toContain(
      "<desc>Developer terminal profile generated with terminal-profile</desc>",
    );
  });

  it("should sanitize content", () => {
    const result = sanitize("<div>unsafe</div>");
    expect(result).toBe("&lt;div&gt;unsafe&lt;/div&gt;");
  });

  it("should valid SVG with defs", () => {
    const svg = pipe(
      createSvgBuilder(KanagawaTheme, { width: 100, height: 100 }),
      (s) => addDefs(s, '<linearGradient id="grad"></linearGradient>'),
      build,
    );

    expect(svg).toContain("<defs>");
    expect(svg).toContain("grad");
    expect(svg).toContain("</defs>");
  });
});
