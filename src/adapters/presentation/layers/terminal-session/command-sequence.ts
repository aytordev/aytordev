import type { TerminalState } from "../../../../domain/entities/terminal-state";
import { renderContact } from "../contact.renderer";
import { renderDeveloperInfo } from "../developer-info.renderer";
import { renderLanguageStats } from "../language-stats.renderer";
import { renderRecentCommits } from "../recent-commits.renderer";
import { calculateTechStackHeight, renderTechStack } from "../tech-stack.renderer";
import type { AnimatedCommand, SectionRenderer } from "./types";

/**
 * Builds the sequence of animated commands based on enabled sections.
 * Pure function - no side effects, no mutations.
 *
 * Temporary adaptation for new TerminalContent shape.
 * Will be fully rewritten to story-driven commands in commit 8.
 */
export const buildCommandSequence = (state: TerminalState): ReadonlyArray<AnimatedCommand> => {
  return [
    state.content.neofetchData.owner &&
      createCommand(
        "terminal-profile --info",
        wrapDeveloperInfoRenderer(state.content.neofetchData.owner),
      ),

    state.content.techStack &&
      createCommand("terminal-profile --stack", wrapTechStackRenderer(state.content.techStack)),

    state.content.languageStats.length > 0 &&
      createCommand(
        "terminal-profile --languages",
        wrapLanguageStatsRenderer(state.content.languageStats),
      ),

    state.content.recentCommits.length > 0 &&
      createCommand(
        "terminal-profile --commits",
        wrapRecentCommitsRenderer(state.content.recentCommits),
      ),

    state.content.contactInfo.length > 0 &&
      createCommand("terminal-profile --contact", wrapContactRenderer(state.content.contactInfo)),
  ].filter(
    (cmd): cmd is AnimatedCommand =>
      cmd !== null &&
      cmd !== false &&
      typeof cmd === "object" &&
      "command" in cmd &&
      "outputRenderer" in cmd,
  );
};

const createCommand = (command: string, renderer: SectionRenderer): AnimatedCommand => ({
  command,
  outputRenderer: renderer,
});

const wrapDeveloperInfoRenderer =
  (content: NonNullable<TerminalState["content"]["neofetchData"]["owner"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderDeveloperInfo(content, theme, y);
    const LINE_HEIGHT = 20;
    const PADDING = 20;
    const height = 3 * LINE_HEIGHT + PADDING;
    return { svg, height };
  };

const wrapTechStackRenderer =
  (content: NonNullable<TerminalState["content"]["techStack"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderTechStack(content, theme, 0, y);
    const height = calculateTechStackHeight(content.categories);
    return { svg, height };
  };

const wrapLanguageStatsRenderer =
  (content: NonNullable<TerminalState["content"]["languageStats"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderLanguageStats(content, theme, y);
    const HEADER_HEIGHT = 24;
    const ROW_HEIGHT = 24;
    const PADDING = 20;
    const height = HEADER_HEIGHT + content.length * ROW_HEIGHT + PADDING;
    return { svg, height };
  };

const wrapRecentCommitsRenderer =
  (content: NonNullable<TerminalState["content"]["recentCommits"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderRecentCommits(content, theme, 0, y);
    const TITLE_HEIGHT = 24;
    const ITEM_HEIGHT = 20;
    const PADDING = 20;
    const height = TITLE_HEIGHT + content.length * ITEM_HEIGHT + PADDING;
    return { svg, height };
  };

const wrapContactRenderer =
  (content: TerminalState["content"]["contactInfo"]): SectionRenderer =>
  (theme, y) => {
    const svg = renderContact(content, theme, y);
    const ITEM_HEIGHT = 20;
    const PADDING = 20;
    const height = content.length * ITEM_HEIGHT + PADDING;
    return { svg, height };
  };

/**
 * Estimates the height of rendered SVG content.
 * Pure function - parses SVG and calculates bounding height.
 */
export const estimateRenderHeight = (svg: string): number => {
  const yCoordinates: number[] = [];
  const heights: number[] = [];

  const yMatches = Array.from(svg.matchAll(/y="?(\d+)"?/g));
  for (const match of yMatches) {
    yCoordinates.push(Number.parseInt(match[1], 10));
  }

  const heightMatches = Array.from(svg.matchAll(/height="?(\d+)"?/g));
  for (const match of heightMatches) {
    heights.push(Number.parseInt(match[1], 10));
  }

  const translateMatches = Array.from(svg.matchAll(/translate\([^,]+,\s*(\d+)\)/g));
  for (const match of translateMatches) {
    yCoordinates.push(Number.parseInt(match[1], 10));
  }

  const maxY = yCoordinates.length > 0 ? Math.max(...yCoordinates) : 0;
  const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;

  return Math.max(20, maxY + maxHeight + 20);
};
