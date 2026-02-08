import { sanitizeForSvg } from "../../../shared/sanitize";
import type { StarshipPrompt } from "../../../domain/entities/starship-prompt";
import type { Theme } from "../../../theme/types";

/**
 * Configuration for prompt rendering
 */
interface PromptRenderConfig {
  readonly fontSize: number;
  readonly initialLeftX: number;
  readonly rightX: number;
  readonly y: number;
}

/**
 * Result of rendering left side of prompt
 */
interface LeftSideResult {
  readonly svg: string;
}

/**
 * Result of rendering right side of prompt
 */
interface RightSideResult {
  readonly svg: string;
}

/**
 * Renders the left side of the prompt (directory, arrow, git info).
 * Pure function - no side effects.
 *
 * @param prompt - Starship prompt data
 * @param theme - Theme configuration
 * @param config - Rendering configuration
 * @returns SVG string for left side elements
 */
export const renderPromptLeftSide = (
  prompt: StarshipPrompt,
  theme: Theme,
  config: PromptRenderConfig,
): LeftSideResult => {
  const { fontSize, initialLeftX, y } = config;

  // 1. Directory (.../aytordev)
  const dirText = prompt.directory;
  const dirWidth = dirText.length * 8.5;
  const leftX1 = initialLeftX;
  const dirSvg = `<text x="${leftX1}" y="${y}" fill="${theme.colors.dragonBlue}" font-family="monospace" font-size="${fontSize}" font-weight="bold">${sanitizeForSvg(dirText)}</text>`;

  // 2. Arrow ->
  const leftX2 = leftX1 + dirWidth + 10;
  const arrowSvg = `<text x="${leftX2}" y="${y}" fill="${theme.colors.textMuted}" font-family="monospace" font-size="${fontSize}" font-weight="bold">→</text>`;

  // 3. Git Branch (git:main ?)
  const leftX3 = leftX2 + 20;
  const gitSvg = prompt.gitBranch
    ? (() => {
        const statusChar = prompt.gitStatus === "dirty" ? "?" : "";
        const branchText = `git:${sanitizeForSvg(prompt.gitBranch)} ${statusChar}`;
        const gitColor = theme.colors.oniViolet;
        return `<text x="${leftX3}" y="${y}" fill="${gitColor}" font-family="monospace" font-size="${fontSize}">${branchText}</text>`;
      })()
    : "";

  return {
    svg: `${dirSvg}\n${arrowSvg}\n${gitSvg}`,
  };
};

/**
 * Renders the right side of the prompt (time, nix, node, git stats).
 * Pure function - no side effects.
 *
 * @param prompt - Starship prompt data
 * @param theme - Theme configuration
 * @param config - Rendering configuration
 * @returns SVG string for right side elements
 */
export const renderPromptRightSide = (
  prompt: StarshipPrompt,
  theme: Theme,
  config: PromptRenderConfig,
): RightSideResult => {
  const { fontSize, rightX, y } = config;

  // Pure function to render right item with explicit x position
  const renderRightItem = (
    x: number,
    text: string,
    color: string,
    isSymbol: boolean = false,
  ): { svg: string; nextX: number } => {
    const w = text.length * 8.5; // Monospace approx
    const itemSvg = `<text x="${x}" y="${y}" fill="${color}" font-family="monospace" font-size="${fontSize}" text-anchor="end" font-weight="${isSymbol ? "bold" : "normal"}">${text}</text>`;
    return {
      svg: itemSvg,
      nextX: x - w - 10, // Spacing
    };
  };

  // Build right side items immutably using reduce
  interface RightAccumulator {
    readonly x: number;
    readonly items: readonly string[];
  }

  const rightItems: Array<{ text: string; color: string; isSymbol?: boolean }> = [];

  // 1. Time (23:50)
  rightItems.push({ text: prompt.time, color: theme.colors.textMuted });

  // 2. Nix (❄️)
  if (prompt.nixIndicator) {
    rightItems.push({ text: "nix", color: theme.colors.dragonBlue });
    rightItems.push({ text: "❄️", color: theme.colors.text, isSymbol: true });
  }

  // 3. Separator (*)
  rightItems.push({ text: "*", color: theme.colors.textMuted });

  // 4. Node (24.13.0)
  if (prompt.nodeVersion) {
    rightItems.push({ text: prompt.nodeVersion, color: theme.colors.autumnGreen });
    rightItems.push({ text: "node", color: theme.colors.autumnGreen, isSymbol: true });
    rightItems.push({ text: "⬢", color: theme.colors.autumnGreen, isSymbol: true });
  }

  // 5. Git Stats (+12 ~5 -3)
  if (prompt.gitStats) {
    if (prompt.gitStats.deleted > 0) {
      rightItems.push({
        text: `-${prompt.gitStats.deleted}`,
        color: theme.colors.samuraiRed,
      });
    }
    if (prompt.gitStats.modified > 0) {
      rightItems.push({
        text: `~${prompt.gitStats.modified}`,
        color: theme.colors.roninYellow,
      });
    }
    if (prompt.gitStats.added > 0) {
      rightItems.push({
        text: `+${prompt.gitStats.added}`,
        color: theme.colors.autumnGreen,
      });
    }
  }

  // Render right items immutably
  const rightResult = rightItems.reduce<RightAccumulator>(
    (acc, item) => {
      const result = renderRightItem(acc.x, item.text, item.color, item.isSymbol);
      return {
        x: result.nextX,
        items: [...acc.items, result.svg],
      };
    },
    { x: rightX, items: [] },
  );

  return {
    svg: rightResult.items.join("\n"),
  };
};

/**
 * Renders a complete Starship-style prompt with both left and right sides.
 * Pure function - composes smaller pure functions.
 *
 * @param prompt - Starship prompt data
 * @param theme - Theme configuration
 * @param y - Y position for prompt baseline
 * @param width - Total width for prompt (default 800)
 * @returns Complete SVG string with prompt elements
 */
export const renderPrompt = (
  prompt: StarshipPrompt,
  theme: Theme,
  y: number,
  width: number = 800,
): string => {
  const fontSize = 14;
  const lineHeight = 20;

  const initialLeftX = 10;
  const rightX = width - 20; // Padding right

  const config: PromptRenderConfig = {
    fontSize,
    initialLeftX,
    rightX,
    y,
  };

  // Compose left and right sides using pure functions
  const leftSide = renderPromptLeftSide(prompt, theme, config);
  const rightSide = renderPromptRightSide(prompt, theme, config);

  // Line 2: Indicator
  const line2Y = y + lineHeight;
  // User requested to remove the symbol (❯)
  const line2Svg = "";

  return `
    <g id="prompt">
      <!-- Left -->
      ${leftSide.svg}

      <!-- Right -->
      ${rightSide.svg}

      <!-- Line 2 -->
      ${line2Svg}

      <!-- Optional blink cursor at end of line 2 -->
      <rect x="10" y="${line2Y - 10}" width="8" height="16" class="cursor" fill="${theme.colors.springGreen}" />

    </g>
  `;
};
