import { sanitizeForSvg } from "../../shared/sanitize";
import type { Theme } from "../../theme/types";
import { generateCss } from "./styles";

interface Dimensions {
  readonly width: number;
  readonly height: number;
}

export interface SvgBuilderState {
  readonly theme: Theme;
  readonly dimensions: Dimensions;
  readonly layers: readonly string[];
  readonly defs: readonly string[];
}

// Factory to create initial state
export const createSvgBuilder = (theme: Theme, dimensions: Dimensions): SvgBuilderState => ({
  theme,
  dimensions,
  layers: [],
  defs: [],
});

// Pure transformation functions
export const addLayer = (state: SvgBuilderState, content: string): SvgBuilderState => ({
  ...state,
  layers: [...state.layers, content],
});

export const addDefs = (state: SvgBuilderState, content: string): SvgBuilderState => ({
  ...state,
  defs: [...state.defs, content],
});

export const sanitize = (content: string): string => sanitizeForSvg(content);

export const build = (state: SvgBuilderState): string => {
  const css = generateCss(state.theme);
  const { width, height } = state.dimensions;

  const defsBlock = state.defs.length > 0 ? `<defs>\n${state.defs.join("\n")}\n</defs>` : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <title>Terminal Profile</title>
  <desc>Developer terminal profile generated with terminal-profile</desc>
  <style>
    ${css}
  </style>

  ${defsBlock}

  <!-- Background with Ghostty-like border -->
  <rect width="100%" height="100%" class="background" rx="10" ry="10" />

  <!-- Layers -->
  ${state.layers.join("\n")}
</svg>
  `.trim();
};

// Helper for functional composition (pipe)
export const pipe = <T>(initial: T, ...fns: Array<(x: T) => T>): T =>
  fns.reduce((acc, fn) => fn(acc), initial);
