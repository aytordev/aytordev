import { describe, expect, it } from "vitest";
import { renderContentArea } from "../../../../adapters/presentation/layers/content-area.renderer";

describe("Content Area Renderer", () => {
  it("should create a group with correct transform", () => {
    // tmux bar is ~24-30px? Prompt is ~40px?
    // Let's assume the orchestrator passes the Y offset
    const y = 80;
    const innerContent = "<text>Test Content</text>";

    const svg = renderContentArea(y, innerContent);

    expect(svg).toContain(`transform="translate(0, ${y})"`);
    expect(svg).toContain('id="content-area"');
    expect(svg).toContain(innerContent);
  });
});
