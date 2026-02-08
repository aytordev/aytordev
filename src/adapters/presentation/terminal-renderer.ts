import type { TerminalState } from "../../domain/entities/terminal-state";
import { getTheme } from "../../theme";
import { buildDefs } from "./effects";
import { renderAsciiArt } from "./layers/ascii-art.renderer";
import { renderContact } from "./layers/contact.renderer";
import { renderContentArea } from "./layers/content-area.renderer";
import { renderDeveloperInfo } from "./layers/developer-info.renderer";
import { renderEngagement } from "./layers/engagement.renderer";
import { renderFooter } from "./layers/footer.renderer";
import { renderLanguageStats } from "./layers/language-stats.renderer";
import { renderPrompt } from "./layers/prompt.renderer";
import { renderRecentCommits } from "./layers/recent-commits.renderer";
import { renderStreak } from "./layers/streak.renderer";
import { renderTechStack } from "./layers/tech-stack.renderer";
import { renderTmuxBar } from "./layers/tmux-bar.renderer";
import { renderTerminalSession } from "./layers/terminal-session.renderer";
import { addDefs, addLayer, build, createSvgBuilder, pipe } from "./svg-builder";
import { generateCss } from "./styles";

/**
 * Type definition for render strategy.
 * Both static and animated renderers follow this signature.
 */
type RenderStrategy = (state: TerminalState) => string;

/**
 * Selects the appropriate render strategy based on animation configuration.
 * Pure function - strategy selection based on state.
 *
 * @param state - Terminal state with animation configuration
 * @returns Render function (static or animated)
 */
const selectRenderStrategy = (state: TerminalState): RenderStrategy =>
  state.animation?.enabled ? renderAnimatedTerminal : renderStaticTerminal;

/**
 * Main orchestrator - Pure function to render a terminal state to SVG string.
 * Uses strategy pattern to select between static and animated rendering.
 * Uses functional composition with immutable state transformations.
 *
 * @param state - Terminal state to render
 * @returns SVG string
 */
export const renderTerminal = (state: TerminalState): string => {
  const strategy = selectRenderStrategy(state);
  return strategy(state);
};

/**
 * Renders terminal in animated mode with scroll simulation.
 * Pure function - composes animated terminal session with surrounding layout.
 *
 * @param state - Terminal state to render
 * @returns SVG string with animations
 */
const renderAnimatedTerminal = (state: TerminalState): string => {
  const theme = getTheme(state.themeName);
  const { width, height } = state.dimensions;

  // Effects configuration
  const effectsConfig = {
    gradient_bars: true,
    subtle_glow: true,
  };

  const defs = buildDefs(theme, effectsConfig);

  // Layout configuration for animated mode
  const tmuxBarHeight = 24;
  const footerHeight = 24;
  const viewportHeight = height - tmuxBarHeight - footerHeight;

  // Generate CSS with animation styles
  const animationSpeed = state.animation?.speed ?? 1;
  const css = generateCss(theme, animationSpeed);

  // Render terminal session (viewport with scrollable content)
  const sessionSvg = renderTerminalSession(state, theme, tmuxBarHeight, viewportHeight);

  // Use functional composition with pipe
  const finalState = pipe(
    createSvgBuilder(theme, { width, height }),
    (s) => (defs ? addDefs(s, defs) : s),
    (s) => addDefs(s, `<style>${css}</style>`),
    (s) => addLayer(s, renderTmuxBar(state.session, theme, 0)),
    (s) => addLayer(s, sessionSvg),
    (s) => addLayer(s, renderFooter("Powered by Terminal Profile", theme, width, height)),
  );

  return build(finalState);
};

/**
 * Renders terminal in static mode (original implementation).
 * Pure function - uses functional composition with immutable state transformations.
 *
 * @param state - Terminal state to render
 * @returns SVG string
 */
const renderStaticTerminal = (state: TerminalState): string => {
  const theme = getTheme(state.themeName);
  const { width, height } = state.dimensions;

  // Effects configuration
  const effectsConfig = {
    gradient_bars: true,
    subtle_glow: true,
  };

  const defs = buildDefs(theme, effectsConfig);

  // Content preparation
  const promptY = 50;
  const contentStartY = 110;

  // ASCII Art rendering - using extracted renderer
  const asciiArtResult = state.content.asciiArt
    ? renderAsciiArt(state.content.asciiArt, theme, 0)
    : { svg: "", offset: 0 };

  const contentOffset = asciiArtResult.offset;

  // Extra lines rendering - immutable
  const extraLinesSvg =
    state.content.extraLines && state.content.extraLines.length > 0
      ? (() => {
          const extraY = 360 + contentOffset;
          const extraLineHeight = 20;
          return state.content.extraLines
            .map(
              (line, i) =>
                `<text x="0" y="${extraY + i * extraLineHeight}" class="terminal-text" fill="${theme.colors.text}" font-family="monospace" font-size="14">${line}</text>`,
            )
            .join("\n");
        })()
      : "";

  // Build inner content immutably
  const innerContent = [
    asciiArtResult.svg,
    `<g transform="translate(0, ${contentOffset})">${renderDeveloperInfo(state.content.developerInfo, theme)}</g>`,
    renderTechStack(state.content.techStack, theme, 0, 60 + contentOffset),
    renderLanguageStats(state.content.languageStats, theme, 140 + contentOffset),
    renderRecentCommits(state.content.recentCommits, theme, 400, 60 + contentOffset),
    renderEngagement(state.content, theme, 200 + contentOffset),
    renderContact(state.content.contactInfo, theme, 280 + contentOffset),
    extraLinesSvg,
  ]
    .filter((content) => content.length > 0)
    .join("\n");

  // Use functional composition with pipe
  const finalState = pipe(
    createSvgBuilder(theme, { width, height }),
    (s) => (defs ? addDefs(s, defs) : s),
    (s) => addLayer(s, renderTmuxBar(state.session, theme, 0)),
    (s) => addLayer(s, renderPrompt(state.prompt, theme, promptY, width)),
    (s) => addLayer(s, renderStreak(state.content.streak, theme, 600, promptY)),
    (s) => addLayer(s, renderContentArea(contentStartY, innerContent)),
    (s) => addLayer(s, renderFooter("Powered by Terminal Profile", theme, width, height)),
  );

  return build(finalState);
};
