import type { TechStack, TechStackCategory } from "../../../domain/value-objects/tech-stack";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

export const calculateTechStackHeight = (categories: readonly TechStackCategory[]): number => {
  if (categories.length === 0) return 0;
  const TITLE_HEIGHT = 24;
  const ITEM_HEIGHT = 20;
  const PADDING = 20;
  const maxItems = Math.max(...categories.map((c) => c.items.length));
  return PADDING + TITLE_HEIGHT + maxItems * ITEM_HEIGHT;
};

export const renderTechStack = (
  stack: TechStack,
  theme: Theme,
  x: number = 0,
  y: number = 0,
): string => {
  const titleHeight = 24;
  const itemHeight = 20;

  // Immutable transformation using reduce
  interface CategoryAccumulator {
    readonly y: number;
    readonly elements: readonly string[];
  }

  const result = stack.categories.reduce<CategoryAccumulator>(
    (acc, category) => {
      // Category Title
      const titleSvg = `
      <text x="0" y="${acc.y}" class="stack__title" fill="${theme.colors.roninYellow}" font-family="monospace" font-size="14" font-weight="bold">
        ${sanitizeForSvg(category.name)}
      </text>
    `;

      const itemsY = acc.y + titleHeight;

      // Items
      const itemsSvg = category.items.map((item, i) => {
        const itemY = itemsY + i * itemHeight;
        return `<text x="15" y="${itemY}" class="stack__item" fill="${theme.colors.text}" font-family="monospace" font-size="12">- ${sanitizeForSvg(item)}</text>`;
      });

      const newY = itemsY + category.items.length * itemHeight + 10; // Extra spacing after category

      return {
        y: newY,
        elements: [...acc.elements, titleSvg, ...itemsSvg],
      };
    },
    { y: 0, elements: [] },
  );

  const elements = result.elements.join("\n");

  return `
    <g id="tech-stack" transform="translate(${x}, ${y})">
      ${elements}
    </g>
  `.trim();
};
