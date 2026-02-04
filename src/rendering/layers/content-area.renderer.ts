/**
 * Renders the main content area container.
 * This effectively acts as a wrapper for all dynamic content blocks.
 *
 * @param y The Y position where the content area starts (after prompt)
 * @param content The already rendered HTML/SVG string of the inner content
 */
export function renderContentArea(y: number, content: string): string {
  return `
    <g id="content-area" transform="translate(0, ${y})">
      ${content}
    </g>
  `.trim();
}
