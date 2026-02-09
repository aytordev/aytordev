import { describe, expect, it } from "vitest";
import { renderContact } from "../../../../adapters/presentation/layers/contact.renderer";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Contact Renderer", () => {
  it("should render nothing if empty", () => {
    const svg = renderContact([], KanagawaTheme);
    expect(svg).toBe("<g></g>");
  });

  it("should render contact items", () => {
    const items = [{ label: "Email", value: "test@test.com", icon: "E" }];
    const svg = renderContact(items, KanagawaTheme);
    expect(svg).toContain("Email");
    expect(svg).toContain("test@test.com");
  });

  it("should render CTA header when provided", () => {
    const items = [{ label: "Email", value: "test@test.com", icon: "E" }];
    const svg = renderContact(items, KanagawaTheme, 0, "Let's connect! \u{1F4AC}");
    expect(svg).toContain("Let&#39;s connect!");
  });

  it("should not render CTA header when not provided", () => {
    const items = [{ label: "Email", value: "test@test.com", icon: "E" }];
    const svg = renderContact(items, KanagawaTheme, 0);
    expect(svg).not.toContain("cta");
  });
});
