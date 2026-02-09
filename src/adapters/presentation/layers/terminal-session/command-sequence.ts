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
 * Pure function - no side effects, no mutations.
 * Uses functional composition to build command array.
 *
 * @param state - Terminal state with content sections
 * @returns Immutable array of commands
 */
export const buildCommandSequence = (
  state: TerminalState,
): ReadonlyArray<AnimatedCommand> => {
  // Build array of potential commands with their conditions
  // Filter out undefined entries for disabled sections
  return [
    // Developer Info
    state.content.developerInfo &&
      createCommand(
        "terminal-profile --info",
        wrapDeveloperInfoRenderer(state.content.developerInfo),
      ),

    // Tech Stack
    state.content.techStack &&
      createCommand(
        "terminal-profile --stack",
        wrapTechStackRenderer(state.content.techStack),
      ),

    // Language Stats
    state.content.languageStats.length > 0 &&
      createCommand(
        "terminal-profile --languages",
        wrapLanguageStatsRenderer(state.content.languageStats),
      ),

    // Recent Commits
    state.content.recentCommits.length > 0 &&
      createCommand(
        "terminal-profile --commits",
        wrapRecentCommitsRenderer(state.content.recentCommits),
      ),

    // Engagement sections
    (state.content.learningJourney ||
      state.content.todayFocus ||
      state.content.dailyQuote) &&
      createCommand(
        "terminal-profile --engagement",
        wrapEngagementRenderer({
          learningJourney: state.content.learningJourney,
          todayFocus: state.content.todayFocus,
          dailyQuote: state.content.dailyQuote,
        }),
      ),

    // Contact
    state.content.contactInfo.length > 0 &&
      createCommand(
        "terminal-profile --contact",
        wrapContactRenderer(state.content.contactInfo),
      ),

    // Streak
    state.content.streak &&
      createCommand(
        "terminal-profile --streak",
        wrapStreakRenderer(state.content.streak),
      ),
  ].filter((cmd): cmd is AnimatedCommand =>
    cmd !== null &&
    cmd !== false &&
    typeof cmd === "object" &&
    "command" in cmd &&
    "outputRenderer" in cmd
  );
};

/**
 * Factory function for creating commands.
 * Pure function.
 */
const createCommand = (
  command: string,
  renderer: SectionRenderer,
): AnimatedCommand => ({
  command,
  outputRenderer: renderer,
});

/**
 * Wrapper functions that adapt existing renderers to SectionRenderer signature
 */

const wrapDeveloperInfoRenderer =
  (
    content: NonNullable<TerminalState["content"]["developerInfo"]>,
  ): SectionRenderer =>
  (theme, y) => {
    const svg = renderDeveloperInfo(content, theme, y);
    // Developer info has 3 lines: username, tagline, location (20px each) + padding
    const LINE_HEIGHT = 20;
    const PADDING = 20;
    const height = 3 * LINE_HEIGHT + PADDING;
    return { svg, height };
  };

const wrapTechStackRenderer =
  (
    content: NonNullable<TerminalState["content"]["techStack"]>,
  ): SectionRenderer =>
  (theme, y) => {
    const svg = renderTechStack(content, theme, 0, y);
    // Calculate height: for each category, title (24px) + items (20px each) + gap (10px)
    const TITLE_HEIGHT = 24;
    const ITEM_HEIGHT = 20;
    const GAP = 10;
    const PADDING = 20;
    let height = PADDING;
    for (const category of content.categories) {
      height += TITLE_HEIGHT + category.items.length * ITEM_HEIGHT + GAP;
    }
    return { svg, height };
  };

const wrapLanguageStatsRenderer =
  (
    content: NonNullable<TerminalState["content"]["languageStats"]>,
  ): SectionRenderer =>
  (theme, y) => {
    const svg = renderLanguageStats(content, theme, y);
    // Calculate exact height: header line (24px) + rows (24px each) + padding (20px)
    const HEADER_HEIGHT = 24;
    const ROW_HEIGHT = 24;
    const PADDING = 20;
    const height = HEADER_HEIGHT + content.length * ROW_HEIGHT + PADDING;
    return { svg, height };
  };

const wrapRecentCommitsRenderer =
  (
    content: NonNullable<TerminalState["content"]["recentCommits"]>,
  ): SectionRenderer =>
  (theme, y) => {
    const svg = renderRecentCommits(content, theme, 0, y); // Changed x from 400 to 0
    // Calculate exact height: title (24px) + commits (20px each) + padding (20px)
    const TITLE_HEIGHT = 24;
    const ITEM_HEIGHT = 20;
    const PADDING = 20;
    const height = TITLE_HEIGHT + content.length * ITEM_HEIGHT + PADDING;
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
    // Calculate exact height based on items: each item takes 2 lines (24px each) + 10px gap
    const ITEM_HEIGHT = 24 * 2 + 10; // Two lines + gap
    const PADDING = 20;
    const itemCount =
      (content.learningJourney ? 1 : 0) +
      (content.todayFocus ? 1 : 0) +
      (content.dailyQuote ? 1 : 0);
    const height = itemCount * ITEM_HEIGHT + PADDING;
    return { svg, height };
  };

const wrapContactRenderer =
  (content: TerminalState["content"]["contactInfo"]): SectionRenderer =>
  (theme, y) => {
    const svg = renderContact(content, theme, y);
    // Calculate exact height: items (20px each) + padding
    const ITEM_HEIGHT = 20;
    const PADDING = 20;
    const height = content.length * ITEM_HEIGHT + PADDING;
    return { svg, height };
  };

const wrapStreakRenderer =
  (content: NonNullable<TerminalState["content"]["streak"]>): SectionRenderer =>
  (theme, y) => {
    const svg = renderStreak(content, theme, 0, y);
    // Streak is just one line with emoji + text
    const height = 40; // Fixed height for streak display
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
  const yMatches = Array.from(svg.matchAll(/y="?(\d+)"?/g));
  for (const match of yMatches) {
    yCoordinates.push(Number.parseInt(match[1], 10));
  }

  // Match height="number" or height="{number}"
  const heightMatches = Array.from(svg.matchAll(/height="?(\d+)"?/g));
  for (const match of heightMatches) {
    heights.push(Number.parseInt(match[1], 10));
  }

  // Match transform="translate(x, y)"
  const translateMatches = Array.from(
    svg.matchAll(/translate\([^,]+,\s*(\d+)\)/g),
  );
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
