import { sanitizeForSvg } from "../shared/sanitize";
import type { Theme } from "../theme/types";
import { generateCss } from "./styles";

interface Dimensions {
  width: number;
  height: number;
}

export class SvgBuilder {
  private layers: string[] = [];

  constructor(
    private readonly theme: Theme,
    private readonly dimensions: Dimensions,
  ) {}

  public addLayer(content: string): void {
    this.layers.push(content);
  }

  public sanitize(content: string): string {
    return sanitizeForSvg(content);
  }

  public build(): string {
    const css = generateCss(this.theme);
    const { width, height } = this.dimensions;

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <title>Terminal Profile</title>
  <desc>Developer terminal profile generated with terminal-profile</desc>
  <style>
    ${css}
  </style>

  <!-- Background -->
  <rect width="100%" height="100%" class="background" rx="4.5" />

  <!-- Layers -->
  ${this.layers.join("\n")}
</svg>
    `.trim();
  }
}
