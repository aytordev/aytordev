import type { TerminalState } from "../../../../domain/entities/terminal-state";
import { renderContact } from "../contact.renderer";
import { renderDeveloperInfo } from "../developer-info.renderer";
import { renderEngagement } from "../engagement.renderer";
import { renderLanguageStats } from "../language-stats.renderer";
import { renderRecentCommits } from "../recent-commits.renderer";
import { renderStreak } from "../streak.renderer";
import { renderTechStack } from "../tech-stack.renderer";
import type { AnimatedCommand, SectionRenderer } from "./types";

/**
 * Builds the sequence of animated commands based on enabled sections.
 * Pure function - no side effects.
 *
 * @param state - Terminal state with content sections
 * @returns Immutable array of commands
 */
export const buildCommandSequence = (state: TerminalState): ReadonlyArray<AnimatedCommand> => {
  const commands: AnimatedCommand[] = [];

  // Developer Info
  if (state.content.developerInfo) {
    commands.push(
      createCommand(
        "terminal-profile --info",
        wrapDeveloperInfoRenderer(state.content.developerInfo),
      ),
    );
  }

  // Tech Stack
  if (state.content.techStack) {
    commands.push(
      createCommand("terminal-profile --stack", wrapTechStackRenderer(state.content.techStack)),
    );
  }

  // Language Stats
  if (state.content.languageStats.length > 0) {
    commands.push(
      createCommand(
        "terminal-profile --languages",
        wrapLanguageStatsRenderer(state.content.languageStats),
      ),
    );
  }

  // Recent Commits
  if (state.content.recentCommits.length > 0) {
    commands.push(
      createCommand(
        "terminal-profile --commits",
        wrapRecentCommitsRenderer(state.content.recentCommits),
      ),
    );
  }

  // Engagement sections
  if (state.content.learningJourney || state.content.todayFocus || state.content.dailyQuote) {
    const engagementContent = {
      learningJourney: state.content.learningJourney,
      todayFocus: state.content.todayFocus,
      dailyQuote: state.content.dailyQuote,
    };

    commands.push(
      createCommand("terminal-profile --engagement", wrapEngagementRenderer(engagementContent)),
    );
  }

  // Contact
  if (state.content.contactInfo.length > 0) {
    commands.push(
      createCommand("terminal-profile --contact", wrapContactRenderer(state.content.contactInfo)),
    );
  }

  // Streak
  if (state.content.streak) {
    commands.push(
      createCommand("terminal-profile --streak", wrapStreakRenderer(state.content.streak)),
    );
  }

  return commands;
};

/**
 * Factory function for creating commands.
 * Pure function.
 */
const createCommand = (command: string, renderer: SectionRenderer): AnimatedCommand => ({
  command,
  outputRenderer: renderer,
});

/**
 * Wrapper functions that adapt existing renderers to SectionRenderer signature
 */

const wrapDeveloperInfoRenderer =
  (content: NonNullable<TerminalState["content"]["developerInfo"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderDeveloperInfo(content, theme, y);
    const height = estimateRenderHeight(svg);
    return { svg, height };
  };

const wrapTechStackRenderer =
  (content: NonNullable<TerminalState["content"]["techStack"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderTechStack(content, theme, 0, y);
    const height = estimateRenderHeight(svg);
    return { svg, height };
  };

const wrapLanguageStatsRenderer =
  (content: NonNullable<TerminalState["content"]["languageStats"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderLanguageStats(content, theme, y);
    const height = estimateRenderHeight(svg);
    return { svg, height };
  };

const wrapRecentCommitsRenderer =
  (content: NonNullable<TerminalState["content"]["recentCommits"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderRecentCommits(content, theme, 400, y);
    const height = estimateRenderHeight(svg);
    return { svg, height };
  };

const wrapEngagementRenderer =
  (content: {
    learningJourney: TerminalState["content"]["learningJourney"];
    todayFocus: TerminalState["content"]["todayFocus"];
    dailyQuote: TerminalState["content"]["dailyQuote"];
  }): SectionRenderer =>
  (theme, y) => {
    const svg = renderEngagement(content, theme, y);
    const height = estimateRenderHeight(svg);
    return { svg, height };
  };

const wrapContactRenderer =
  (content: TerminalState["content"]["contactInfo"]): SectionRenderer =>
  (theme, y) => {
    const svg = renderContact(content, theme, y);
    const height = estimateRenderHeight(svg);
    return { svg, height };
  };

const wrapStreakRenderer =
  (content: NonNullable<TerminalState["content"]["streak"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderStreak(content, theme, 0, y);
    const height = estimateRenderHeight(svg);
    return { svg, height };
  };

/**
 * Estimates the height of rendered SVG content.
 * Pure function - parses SVG and calculates bounding height.
 *
 * @param svg - SVG string to analyze
 * @returns Estimated height in pixels
 */
export const estimateRenderHeight = (svg: string): number => {
  // Extract Y coordinates and heights from the SVG
  const yCoordinates: number[] = [];
  const heights: number[] = [];

  // Match y="number" or y="{number}"
  const yMatches = svg.matchAll(/y="?(\d+)"?/g);
  for (const match of yMatches) {
    yCoordinates.push(Number.parseInt(match[1], 10));
  }

  // Match height="number" or height="{number}"
  const heightMatches = svg.matchAll(/height="?(\d+)"?/g);
  for (const match of heightMatches) {
    heights.push(Number.parseInt(match[1], 10));
  }

  // Match transform="translate(x, y)"
  const translateMatches = svg.matchAll(/translate\([^,]+,\s*(\d+)\)/g);
  for (const match of translateMatches) {
    yCoordinates.push(Number.parseInt(match[1], 10));
  }

  // Calculate maximum Y position
  const maxY = yCoordinates.length > 0 ? Math.max(...yCoordinates) : 0;
  const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;

  // Return the estimated height (maxY + maxHeight + padding)
  // Minimum 20px (one line height)
  return Math.max(20, maxY + maxHeight + 20);
};
