import { describe, expect, it } from "vitest";
import type { DeveloperInfo } from "../../../../domain/entities/terminal-content";
import { renderDeveloperInfo } from "../../../../adapters/presentation/layers/developer-info.renderer";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Developer Info Renderer", () => {
  const info: DeveloperInfo = {
    name: "Aytor",
    username: "aytordev",
    tagline: "Full Stack Developer",
    location: "Spain",
  };

  it("should render username with correct class", () => {
    const svg = renderDeveloperInfo(info, KanagawaTheme);
    expect(svg).toContain("@aytordev");
    expect(svg).toContain('class="dev__username"');
  });

  it("should render name/bio/tagline", () => {
    const svg = renderDeveloperInfo(info, KanagawaTheme);
    expect(svg).toContain("Full Stack Developer");
    expect(svg).toContain('class="dev__role"');
  });

  it("should render location with icon", () => {
    const svg = renderDeveloperInfo(info, KanagawaTheme);
    expect(svg).toContain("Spain");
    expect(svg).toContain("📍"); // Assumed icon
    expect(svg).toContain('class="dev__location"');
  });
});
