import { describe, expect, it } from "vitest";
import { renderDeveloperInfo } from "../../../../adapters/presentation/layers/developer-info.renderer";
import type { DeveloperInfo } from "../../../../domain/entities/terminal-content";
import { KanagawaTheme } from "../../../../theme/kanagawa";
import { svgAssertions } from "../../../__support__/helpers";

describe("Developer Info Renderer", () => {
  const info: DeveloperInfo = {
    name: "Aytor",
    username: "aytordev",
    tagline: "Full Stack Developer",
    location: "Spain",
  };

  it("should render username with correct class", () => {
    const svg = renderDeveloperInfo(info, KanagawaTheme);
    svgAssertions.hasText(svg, "@aytordev");
    svgAssertions.hasClass(svg, "dev__username");
  });

  it("should render name/bio/tagline", () => {
    const svg = renderDeveloperInfo(info, KanagawaTheme);
    svgAssertions.hasText(svg, "Full Stack Developer");
    svgAssertions.hasClass(svg, "dev__role");
  });

  it("should render location with icon", () => {
    const svg = renderDeveloperInfo(info, KanagawaTheme);
    svgAssertions.hasText(svg, "Spain");
    svgAssertions.hasText(svg, "📍");
    svgAssertions.hasClass(svg, "dev__location");
  });
});
