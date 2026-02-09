import type { TerminalState } from "../../domain/entities/terminal-state";
import { getTheme } from "../../theme";
import { buildDefs } from "./effects";
import { renderContact } from "./layers/contact.renderer";
import { renderContentArea } from "./layers/content-area.renderer";
import { renderDeveloperInfo } from "./layers/developer-info.renderer";
import { renderFooter } from "./layers/footer.renderer";
import { renderLanguageStats } from "./layers/language-stats.renderer";
import { renderPrompt } from "./layers/prompt.renderer";
import { renderRecentCommits } from "./layers/recent-commits.renderer";
import { renderTechStack } from "./layers/tech-stack.renderer";
import { renderTmuxBar } from "./layers/tmux-bar.renderer";
import { renderTerminalSession } from "./layers/terminal-session.renderer";
import { addDefs, addLayer, build, createSvgBuilder, pipe } from "./svg-builder";
import { generateCss } from "./styles";

type RenderStrategy = (state: TerminalState) => string;

const selectRenderStrategy = (state: TerminalState): RenderStrategy =>
  state.animation?.enabled ? renderAnimatedTerminal : renderStaticTerminal;

export const renderTerminal = (state: TerminalState): string => {
  const strategy = selectRenderStrategy(state);
  return strategy(state);
};

const renderAnimatedTerminal = (state: TerminalState): string => {
  const theme = getTheme(state.themeName);
  const { width, height } = state.dimensions;

  const effectsConfig = {
    gradient_bars: true,
    subtle_glow: true,
  };

  const defs = buildDefs(theme, effectsConfig);

  const tmuxBarHeight = 24;
  const footerHeight = 24;
  const viewportHeight = height - tmuxBarHeight - footerHeight;

  const animationSpeed = state.animation?.speed ?? 1;
  const css = generateCss(theme, animationSpeed);

  const sessionSvg = renderTerminalSession(state, theme, tmuxBarHeight, viewportHeight);

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
 * Static mode rendering - temporary adaptation for new TerminalContent shape.
 * Uses neofetchData.owner for developer info, removes asciiArt/extraLines/engagement/streak.
 */
const renderStaticTerminal = (state: TerminalState): string => {
  const theme = getTheme(state.themeName);
  const { width, height } = state.dimensions;

  const effectsConfig = {
    gradient_bars: true,
    subtle_glow: true,
  };

  const defs = buildDefs(theme, effectsConfig);

  const promptY = 50;
  const contentStartY = 110;

  const innerContent = [
    `<g transform="translate(0, 0)">${renderDeveloperInfo(state.content.neofetchData.owner, theme)}</g>`,
    renderTechStack(state.content.techStack, theme, 0, 60),
    renderLanguageStats(state.content.languageStats, theme, 140),
    renderRecentCommits(state.content.recentCommits, theme, 400, 60),
    renderContact(state.content.contactInfo, theme, 280),
  ]
    .filter((content) => content.length > 0)
    .join("\n");

  const finalState = pipe(
    createSvgBuilder(theme, { width, height }),
    (s) => (defs ? addDefs(s, defs) : s),
    (s) => addLayer(s, renderTmuxBar(state.session, theme, 0)),
    (s) => addLayer(s, renderPrompt(state.prompt, theme, promptY, width)),
    (s) => addLayer(s, renderContentArea(contentStartY, innerContent)),
    (s) => addLayer(s, renderFooter("Powered by Terminal Profile", theme, width, height)),
  );

  return build(finalState);
};
