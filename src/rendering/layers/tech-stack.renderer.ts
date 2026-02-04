import type { TechStack } from "../../domain/value-objects/tech-stack";
import type { Theme } from "../../theme/types";

export const renderTechStack = (stack: TechStack, theme: Theme): string => {
  const titleHeight = 24;
  const itemHeight = 20;
  let currentY = 0;
  let elements = "";

  // Title for the whole section (optional, or per category?)
  // Requirement says "Tech Stack" section, often integrated in UI
  // Let's iterate categories

  stack.categories.forEach((category) => {
    // Category Title
    elements += `
      <text x="0" y="${currentY}" class="stack__title" fill="${theme.colors.roninYellow}" font-family="monospace" font-size="14" font-weight="bold">
        ${category.name}
      </text>
    `;
    currentY += titleHeight;

    // Items (simple list for now, could be grid)
    const storedItems = category.items
      .map((item, i) => {
        // Basic layout: inline or list?
        // "list" style for clean terminal look
        return `<text x="15" y="${currentY + i * itemHeight}" class="stack__item" fill="${theme.colors.text}" font-family="monospace" font-size="12">- ${item}</text>`;
      })
      .join("");

    elements += storedItems;
    currentY += category.items.length * itemHeight + 10; // Extra spacing after category
  });

  return `
    <g id="tech-stack" transform="translate(0, 60)">
      ${elements}
    </g>
  `.trim();
};
