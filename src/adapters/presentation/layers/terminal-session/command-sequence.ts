import type { TerminalState } from "../../../../domain/entities/terminal-state";
import { renderContact } from "../contact.renderer";
import { renderFeaturedRepos } from "../featured-repos.renderer";
import { renderJourney } from "../journey.renderer";
import { renderLanguageStats } from "../language-stats.renderer";
import { renderNeofetch } from "../neofetch.renderer";
import { renderRecentCommits } from "../recent-commits.renderer";
import { calculateTechStackHeight, renderTechStack } from "../tech-stack.renderer";
import type { AnimatedCommand, SectionRenderer } from "./types";

const createCommand = (command: string, renderer: SectionRenderer): AnimatedCommand => ({
  command,
  outputRenderer: renderer,
});

/** Approximate SVG text ascent for monospace fonts: ceil(fontSize × 0.8) */
const svgTextAscent = (fontSize: number): number => Math.ceil(fontSize * 0.8);

const wrapNeofetchRenderer =
  (data: TerminalState["content"]["neofetchData"]): SectionRenderer =>
  (theme, y) => {
    const result = renderNeofetch(data, theme, y);
    return { svg: result.svg, height: result.height };
  };

const wrapJourneyRenderer =
  (entries: TerminalState["content"]["journey"]): SectionRenderer =>
  (theme, y) => {
    const ascent = svgTextAscent(14); // First element: icon text at font-14
    const result = renderJourney(entries, theme, y + ascent);
    return { svg: result.svg, height: result.height + ascent };
  };

const wrapLanguageStatsRenderer =
  (stats: TerminalState["content"]["languageStats"]): SectionRenderer =>
  (theme, y) => {
    const ascent = svgTextAscent(11); // First element: header text at font-11
    const svg = renderLanguageStats(stats, theme, y + ascent);
    const HEADER_START_Y = 16; // First bar row offset from group origin
    const ROW_HEIGHT = 24;
    const BAR_HEIGHT = 14; // Actual bar visual height
    const height = ascent + HEADER_START_Y + (stats.length - 1) * ROW_HEIGHT + BAR_HEIGHT;
    return { svg, height };
  };

const wrapTechStackRenderer =
  (stack: TerminalState["content"]["techStack"]): SectionRenderer =>
  (theme, y) => {
    const svg = renderTechStack(stack, theme, 0, y);
    const height = calculateTechStackHeight(stack.categories);
    return { svg, height };
  };

const wrapRecentCommitsRenderer =
  (commits: TerminalState["content"]["recentCommits"]): SectionRenderer =>
  (theme, y) => {
    const ascent = svgTextAscent(12); // First element: commit text at font-12
    const svg = renderRecentCommits(commits, theme, 0, y + ascent);
    const ITEM_HEIGHT = 20;
    const TEXT_DESCENT = 3; // Visual extent below last text baseline
    const height = ascent + (commits.length - 1) * ITEM_HEIGHT + TEXT_DESCENT;
    return { svg, height };
  };

const wrapFeaturedReposRenderer =
  (repos: TerminalState["content"]["featuredRepos"]): SectionRenderer =>
  (theme, y) => {
    const ascent = svgTextAscent(12); // First element: star count text at font-12
    const result = renderFeaturedRepos(repos, theme, y + ascent);
    return { svg: result.svg, height: result.height + ascent };
  };

const wrapContactRenderer =
  (items: TerminalState["content"]["contactInfo"], cta: string): SectionRenderer =>
  (theme, y) => {
    const ascent = cta ? svgTextAscent(13) : svgTextAscent(12); // CTA font-13, items font-12
    const svg = renderContact(items, theme, y + ascent, cta);
    const ITEM_HEIGHT = 20;
    const TEXT_DESCENT = 3; // Visual extent below last text baseline
    const CTA_OFFSET = cta ? 24 : 0;
    const height = ascent + CTA_OFFSET + (items.length - 1) * ITEM_HEIGHT + TEXT_DESCENT;
    return { svg, height };
  };

/**
 * Builds the story-driven command sequence with 7 narrative commands.
 * Pure function - no side effects, no mutations.
 */
export const buildCommandSequence = (state: TerminalState): ReadonlyArray<AnimatedCommand> => {
  const { content } = state;

  return [
    createCommand("neofetch", wrapNeofetchRenderer(content.neofetchData)),

    content.journey.length > 0 &&
      createCommand("cat journey.md", wrapJourneyRenderer(content.journey)),

    content.languageStats.length > 0 &&
      createCommand("gh api /langs --sort usage", wrapLanguageStatsRenderer(content.languageStats)),

    content.techStack.categories.length > 0 &&
      createCommand("cat ~/.stack", wrapTechStackRenderer(content.techStack)),

    content.recentCommits.length > 0 &&
      createCommand("git log --oneline -5", wrapRecentCommitsRenderer(content.recentCommits)),

    content.featuredRepos.length > 0 &&
      createCommand(
        "gh repo list --limit 3 --sort stars",
        wrapFeaturedReposRenderer(content.featuredRepos),
      ),

    content.contactInfo.length > 0 &&
      createCommand(
        `echo "${content.contactCta}"`,
        wrapContactRenderer(content.contactInfo, content.contactCta),
      ),
  ].filter(
    (cmd): cmd is AnimatedCommand =>
      cmd !== null &&
      cmd !== false &&
      typeof cmd === "object" &&
      "command" in cmd &&
      "outputRenderer" in cmd,
  );
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
