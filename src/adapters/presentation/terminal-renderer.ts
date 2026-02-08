import type { TerminalState } from "../../domain/entities/terminal-state";
import { getTheme } from "../../theme";
import { buildDefs } from "./effects";
import { wrapWithTyping } from "./effects/typing";
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
import { addDefs, addLayer, build, createSvgBuilder, pipe } from "./svg-builder";

export class TerminalRenderer {
  public render(state: TerminalState): string {
    const theme = getTheme(state.themeName);
    const { width, height } = state.dimensions;

    // Effects configuration
    const effectsConfig = {
      gradient_bars: true,
      subtle_glow: true,
    };

    const defs = buildDefs(theme, effectsConfig);

    // Greeting preparation
    const greetingY = 50;
    const disableAnimations = state.renderOptions?.disableAnimations ?? false;
    const animatedGreeting = !disableAnimations ? wrapWithTyping(state.greeting) : state.greeting;

    const foreignObj = `
      <foreignObject x="10" y="${greetingY - 15}" width="600" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: monospace; color: ${theme.colors.fujiWhite}; font-weight: bold; font-size: 14px;">
          ${animatedGreeting}
        </div>
      </foreignObject>
    `;

    // Content preparation
    const promptY = 80;
    const contentStartY = 140;

    let contentOffset = 0;
    let asciiSvg = "";
    if (state.content.asciiArt) {
      const artLines = state.content.asciiArt.split("\n");
      const artLineHeight = 14;
      artLines.forEach((line, i) => {
        asciiSvg += `<text x="0" y="${i * artLineHeight}" class="terminal-text" fill="${theme.colors.dragonBlue}" font-family="monospace" font-size="12" xml:space="preserve">${line}</text>`;
      });
      contentOffset = artLines.length * artLineHeight + 20;
    }

    let innerContent = asciiSvg;
    innerContent += `<g transform="translate(0, ${contentOffset})">${renderDeveloperInfo(state.content.developerInfo, theme)}</g>`;
    innerContent += renderTechStack(state.content.techStack, theme, 0, 60 + contentOffset);
    innerContent += renderLanguageStats(state.content.languageStats, theme, 140 + contentOffset);
    innerContent += renderRecentCommits(
      state.content.recentCommits,
      theme,
      400,
      60 + contentOffset,
    );
    innerContent += renderEngagement(state.content, theme, 200 + contentOffset);
    innerContent += renderContact(state.content.contactInfo, theme, 280 + contentOffset);

    if (state.content.extraLines && state.content.extraLines.length > 0) {
      const extraY = 360 + contentOffset;
      const extraLineHeight = 20;
      state.content.extraLines.forEach((line, i) => {
        innerContent += `<text x="0" y="${extraY + i * extraLineHeight}" class="terminal-text" fill="${theme.colors.text}" font-family="monospace" font-size="14">${line}</text>`;
      });
    }

    // Use functional composition with pipe
    const finalState = pipe(
      createSvgBuilder(theme, { width, height }),
      (s) => (defs ? addDefs(s, defs) : s),
      (s) => addLayer(s, renderTmuxBar(state.session, theme, 0)),
      (s) => addLayer(s, `<g id="greeting">${foreignObj}</g>`),
      (s) => addLayer(s, renderPrompt(state.prompt, theme, promptY, width)),
      (s) => addLayer(s, renderStreak(state.content.streak, theme, 600, promptY)),
      (s) => addLayer(s, renderContentArea(contentStartY, innerContent)),
      (s) => addLayer(s, renderFooter("Powered by Terminal Profile", theme, width, height)),
    );

    return build(finalState);
  }
}
