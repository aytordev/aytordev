import type { ContactItem } from "../../../domain/value-objects/contact-item";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

/** SVG paths for contact icons (12x12 viewBox) */
const CONTACT_ICONS: Record<string, string> = {
  github:
    "M6 .28a6 6 0 0 0-1.9 11.69c.3.06.4-.13.4-.28v-1.06c-1.64.36-1.98-.72-1.98-.72a1.56 1.56 0 0 0-.65-.86c-.53-.36.04-.36.04-.36a1.23 1.23 0 0 1 .9.6 1.25 1.25 0 0 0 1.7.49 1.24 1.24 0 0 1 .37-.78c-1.3-.15-2.67-.65-2.67-2.9A2.27 2.27 0 0 1 2.81 4.6a2.1 2.1 0 0 1 .06-1.55s.49-.16 1.62.6a5.6 5.6 0 0 1 2.95 0c1.13-.76 1.63-.6 1.63-.6a2.1 2.1 0 0 1 .05 1.55A2.27 2.27 0 0 1 9.8 6.2c0 2.26-1.38 2.75-2.68 2.9a1.4 1.4 0 0 1 .39 1.08v1.6c0 .15.1.34.4.28A6 6 0 0 0 6 .28",
  webpage:
    "M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0Zm-.6 11.04c-2.16-.36-3.84-2.28-3.84-4.56 0-.12 0-.24.01-.36L4.2 8.76v.6c0 .66.54 1.2 1.2 1.2v.48Zm4.14-1.56A1.19 1.19 0 0 0 8.4 8.64h-.6V7.2c0-.33-.27-.6-.6-.6H3.6V5.4h1.2c.33 0 .6-.27.6-.6V3.6h1.2c.66 0 1.2-.54 1.2-1.2v-.25a4.81 4.81 0 0 1 1.74 7.33Z",
  email:
    "M1.2 1.8h9.6c.66 0 1.2.54 1.2 1.2v6c0 .66-.54 1.2-1.2 1.2H1.2C.54 10.2 0 9.66 0 9V3c0-.66.54-1.2 1.2-1.2Zm0 1.2v.72L6 6.96l4.8-3.24V3H1.2Zm0 6h9.6V4.92L6 8.16.12 4.38l-.02.01L0 4.92l.1-.53L0 4.92V9c0 0 0 0 0 0h1.2Z",
};

const ICON_SIZE = 12;
const ICON_LABEL_GAP = 6;
const LABEL_VALUE_X = 100;

const renderContactIcon = (iconName: string, x: number, cy: number, color: string): string => {
  const path = CONTACT_ICONS[iconName];
  if (!path) return "";
  const iconY = cy - ICON_SIZE + 2;
  return `<svg x="${x}" y="${iconY}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 12 12"><path d="${path}" fill="${color}"/></svg>`;
};

export const renderContact = (
  items: readonly ContactItem[],
  theme: Theme,
  y: number = 0,
  cta?: string,
): string => {
  if (!items || items.length === 0) {
    return "<g></g>";
  }

  const itemHeight = 20;
  const ctaOffset = cta ? 24 : 0;

  const ctaSvg = cta
    ? `<text x="0" y="0" class="contact__cta" fill="${theme.colors.carpYellow}" font-family="monospace" font-size="13" font-weight="bold">${sanitizeForSvg(cta)}</text>`
    : "";

  const labelX = ICON_SIZE + ICON_LABEL_GAP;

  const elements = items
    .map((item, i) => {
      const cy = ctaOffset + i * itemHeight;
      const iconSvg = renderContactIcon(item.icon, 0, cy, theme.colors.textMuted);
      return `${iconSvg}
        <text x="${labelX}" y="${cy}" fill="${theme.colors.textMuted}" font-size="12" font-family="monospace">${sanitizeForSvg(item.label)}</text>
        <text x="${LABEL_VALUE_X}" y="${cy}" fill="${theme.colors.text}" font-size="12" font-family="monospace">${sanitizeForSvg(item.value)}</text>`;
    })
    .join("\n");

  return `
    <g id="contact" transform="translate(0, ${y})">
      ${ctaSvg}
      ${elements}
    </g>
  `.trim();
};
