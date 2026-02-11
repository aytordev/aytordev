import { describe, expect, it } from "vitest";
import { renderFooter } from "../../../../adapters/presentation/layers/footer.renderer";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Footer Renderer", () => {
  it("should render footer text", () => {
    const svg = renderFooter("powered by @aytordev", KanagawaTheme);
    expect(svg).toContain("powered by @aytordev");
  });
});
