import { pipe, curry3, compose } from "../../../shared/fp-utils";
import type { Theme } from "../../../theme/types";

/**
 * Renders a single line of ASCII art as SVG text element
 * Curried for composition
 */
const renderArtLine = curry3(
  (theme: Theme, yOffset: number, lineIndex: number) =>
    (line: string): string => {
      const artLineHeight = 14;
      const y = yOffset + lineIndex * artLineHeight;
      return `<text x="0" y="${y}" class="terminal-text" fill="${theme.colors.dragonBlue}" font-family="monospace" font-size="12" xml:space="preserve">${line}</text>`;
    },
);

/**
 * Calculates the vertical offset for content after ASCII art
 */
const calculateOffset = (lineCount: number): number => {
  const artLineHeight = 14;
  return lineCount * artLineHeight + 20;
};

/**
 * Renders ASCII art with proper positioning and styling
 * Uses functional composition with curry for flexibility
 *
 * @param art - ASCII art string with newlines
 * @param theme - Theme for colors
 * @param yOffset - Y offset for positioning (default: 0)
 * @returns Object with SVG string and offset for content positioning
 */
export const renderAsciiArt = (
  art: string,
  theme: Theme,
  yOffset: number = 0,
): { svg: string; offset: number } => {
  const artLines = art.split("\n");

  // Use pipe to compose transformations
  const svg = pipe(
    artLines,
    (lines) => lines.map((line, i) => renderArtLine(theme)(yOffset)(i)(line)),
    (svgLines) => svgLines.join("\n"),
  );

  return {
    svg,
    offset: calculateOffset(artLines.length),
  };
};
