import type { StarshipPrompt } from "../../../domain/entities/starship-prompt";
import type { Theme } from "../../../theme/types";

export const renderPrompt = (
  prompt: StarshipPrompt,
  theme: Theme,
  y: number,
  width: number = 800,
): string => {
  const fontSize = 14;
  const lineHeight = 20;

  let leftX = 10;
  let rightX = width - 20; // Padding right

  // --- LEFT SIDE ---

  // 1. Directory (.../aytordev)
  // Truncate if too long? For now render as is.
  const dirText = prompt.directory;
  const dirWidth = dirText.length * 8.5;
  const dirSvg = `<text x="${leftX}" y="${y}" fill="${theme.colors.dragonBlue}" font-family="monospace" font-size="${fontSize}" font-weight="bold">${dirText}</text>`;
  leftX += dirWidth + 10;

  // Arrow ->
  const arrowSvg = `<text x="${leftX}" y="${y}" fill="${theme.colors.textMuted}" font-family="monospace" font-size="${fontSize}" font-weight="bold">→</text>`;
  leftX += 20;

  // Git Branch (git:main ?)
  let gitSvg = "";
  if (prompt.gitBranch) {
    const statusChar = prompt.gitStatus === "dirty" ? "?" : "";
    const branchText = `git:${prompt.gitBranch} ${statusChar}`;
    // Color: Blue text? Image showed Blue "git:main".
    const gitColor = theme.colors.oniViolet;
    gitSvg = `<text x="${leftX}" y="${y}" fill="${gitColor}" font-family="monospace" font-size="${fontSize}">${branchText}</text>`;
    // No leftX update needed as it's the last item on left?
    // But good practice to update if we add more.
    leftX += branchText.length * 8.5 + 10;
  }

  // --- RIGHT SIDE ---
  // We render from Right to Left? Or calculate total width?
  // SVG text "text-anchor='end'" is easier!

  let rightSvg = "";
  let currentRightX = rightX;

  const renderRightItem = (
    text: string,
    color: string,
    isSymbol: boolean = false,
  ) => {
    // Estimate width
    const w = text.length * 8.5; // Monospace approx
    // Render with anchor end?
    // <text x="${currentRightX}" text-anchor="end">
    const itemSvg = `<text x="${currentRightX}" y="${y}" fill="${color}" font-family="monospace" font-size="${fontSize}" text-anchor="end" font-weight="${isSymbol ? "bold" : "normal"}">${text}</text>`;
    currentRightX -= w + 10; // Spacing
    return itemSvg;
  };

  // Order from Right Edge: Time -> Nix -> Separator -> Node -> GitStats

  // 1. Time (23:50)
  rightSvg += renderRightItem(prompt.time, theme.colors.textMuted);

  // 2. Nix (❄️)
  if (prompt.nixIndicator) {
    // Nix icon width might be distinct?
    // Using simple text render for now.
    rightSvg += renderRightItem("nix", theme.colors.dragonBlue); // "via nix" or just "nix"? Image: "nix"
    rightSvg += renderRightItem("❄️", theme.colors.text, true); // Icon
  }

  // 3. Separator (*)
  rightSvg += renderRightItem("*", theme.colors.textMuted);

  // 4. Node (24.13.0)
  if (prompt.nodeVersion) {
    rightSvg += renderRightItem(prompt.nodeVersion, theme.colors.autumnGreen);
    rightSvg += renderRightItem("node", theme.colors.autumnGreen, true); // Label? Image: "node 24.13.0"
    // "node" icon? NerdFont? ⬢
    rightSvg += renderRightItem("⬢", theme.colors.autumnGreen, true);
  }

  // 5. Git Stats (+12 ~5 -3)
  // "A la izquierda de node aparecen los cambios" -> So next in Right-to-Left chain.
  if (prompt.gitStats) {
    if (prompt.gitStats.deleted > 0) {
      rightSvg += renderRightItem(
        `-${prompt.gitStats.deleted}`,
        theme.colors.samuraiRed,
      );
    }
    if (prompt.gitStats.modified > 0) {
      rightSvg += renderRightItem(
        `~${prompt.gitStats.modified}`,
        theme.colors.roninYellow,
      );
    }
    if (prompt.gitStats.added > 0) {
      rightSvg += renderRightItem(
        `+${prompt.gitStats.added}`,
        theme.colors.autumnGreen,
      );
    }
  }

  // Line 2: Indicator
  const line2Y = y + lineHeight;
  // User requested to remove the symbol (❯)
  const line2Svg = "";

  return `
    <g id="prompt">
      <!-- Left -->
      ${dirSvg}
      ${arrowSvg}
      ${gitSvg}

      <!-- Right -->
      ${rightSvg}

      <!-- Line 2 -->
      ${line2Svg}

      <!-- Optional blink cursor at end of line 2 -->
      <rect x="10" y="${line2Y - 10}" width="8" height="16" class="cursor" fill="${theme.colors.springGreen}" />

    </g>
  `;
};
