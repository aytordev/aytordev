import type { ContactItem } from "../../domain/value-objects/contact-item";
import { sanitizeForSvg } from "../../shared/sanitize";
import type { Theme } from "../../theme/types";

export const renderContact = (
  items: readonly ContactItem[],
  theme: Theme,
  y: number = 0,
): string => {
  if (!items || items.length === 0) {
    return "<g></g>";
  }

  const itemHeight = 20;
  let currentY = 0;

  const elements = items
    .map((item, i) => {
      const cy = currentY + i * itemHeight;
      return `
        <text x="0" y="${cy}" fill="${theme.colors.textMuted}" font-size="12" font-family="monospace">
          ${sanitizeForSvg(item.icon)} ${sanitizeForSvg(item.label)}:
        </text>
        <text x="100" y="${cy}" fill="${theme.colors.text}" font-size="12" font-family="monospace">
          ${sanitizeForSvg(item.value)}
        </text>
      `;
    })
    .join("");

  return `
    <g id="contact" transform="translate(0, ${y})">
      ${elements}
    </g>
  `.trim();
};
