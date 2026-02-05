import { describe, expect, it } from "vitest";
import { renderFooter } from "../../../rendering/layers/footer.renderer";
import { KanagawaTheme } from "../../../theme/kanagawa";

describe("Footer Renderer", () => {
  it("should render footer text", () => {
    const svg = renderFooter("Powered by Terminal Profile", KanagawaTheme);
    expect(svg).toContain("Powered by Terminal Profile");
  });
});
