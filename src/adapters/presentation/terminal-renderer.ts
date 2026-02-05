import type { TerminalState } from "../../domain/entities/terminal-state";
import { getTheme } from "../../theme";
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
import { SvgBuilder } from "./svg-builder";

import { buildDefs } from "./effects";

export class TerminalRenderer {
  public render(state: TerminalState): string {
    const theme = getTheme(state.themeName);
    const { width, height } = state.dimensions;

    const builder = new SvgBuilder(theme, { width, height });

    // Add Effects Defs
    // Mocking effects config for now as it's not in TerminalState yet
    // In Phase 0 strict, we should probably add it to TerminalState or Defaults
    // state.content doesn't have effects.
    // Spec says Config has effects. TerminalState has content.
    // generateTerminalProfile (Use Case) should pass config or applied config to Renderer.
    // Here we only receive TerminalState.
    // GAP: TerminalState should probably include visual preferences or we pass Config to render.
    // Spec 6.2: renderTerminal(state: TerminalState, config: Config)
    // My signature: render(state: TerminalState)
    // I will stick to signature but assume defaults for strict phase demonstration
    // OR ideally update signature, but that requires updating UseCases/Main.
    // I'll assume defaults enabled for demonstration (kanagawa wave implies some flashiness).

    // Let's treat them as enabled if theme supports it or just hardcode for Phase 0 demonstration
    const effectsConfig = {
      gradient_bars: true,
      subtle_glow: true, // Enabled for Phase 2 polish
    };

    const defs = buildDefs(theme, effectsConfig);
    if (defs) {
      builder.addDefs(defs);
    }

    // 1. Tmux Status Bar (Top)
    // Moved to top as per user request
    builder.addLayer(renderTmuxBar(state.session, theme, 0));

    // 1.5 Greeting (Below Tmux Bar, Above Prompt)
    const greetingY = 50;
    const greetingText = `<text x="10" y="${greetingY}" class="terminal-text" fill="${theme.colors.fujiWhite}" font-weight="bold">${state.greeting}</text>`;
    builder.addLayer(`<g id="greeting">${greetingText}</g>`);

    // 2. Prompt (Offset by Tmux Bar + Greeting)
    // Tmux bar is 24px height. Greeting is at 50. Prompt starts around 74?
    // Let's shift prompt deeper.
    const promptY = 80;
    builder.addLayer(renderPrompt(state.prompt, theme, promptY));

    // 3. Streak (Top Right)
    // Align with prompt
    builder.addLayer(renderStreak(state.content.streak, theme, 600, promptY));

    // 4. Content Area (Middle)
    // Shift content start to ~140.
    let contentStartY = 140;
    let innerContent = "";

    // 4.0 Custom ASCII Art (Optional Header)
    if (state.content.asciiArt) {
      const artLines = state.content.asciiArt.split("\n");
      const artLineHeight = 14; // Tighter leading for ASCII
      const artColor = theme.colors.dragonBlue; // Crystal Blue/Cyan for tech vibe

      artLines.forEach((line, i) => {
        const y = contentStartY + i * artLineHeight;
        // Using preserve space to keep ASCII shape
        innerContent += `<text x="0" y="${y}" class="terminal-text" fill="${artColor}" font-family="monospace" font-size="12" xml:space="preserve">${line}</text>`;
      });

      contentStartY += artLines.length * artLineHeight + 20; // Padding
    }

    // 4.1 Developer Info
    innerContent += renderDeveloperInfo(
      state.content.developerInfo,
      theme,
      contentStartY - 140, // Reset logic: The helpers assume 0-based from wrapper?
      // Wait, renderDeveloperInfo doesn't take Y except my earlier thought?
      // Check signature: renderDeveloperInfo(info, theme).
      // It returns text elements at y=0, y=20 etc relative to wrapper.
      // So I must translate the groups? Use "transform" on sub-groups?
      // renderContentArea wraps everything in <g id="content-area" transform="translate(0, y)">
      // So innerContent elements start at 0 relative to contentStartY.
      // If I render ASCII at 0, dev info needs to be at ASCII_HEIGHT.
    );

    // FIX: Refactor logic.
    // contentStartY is the global Y of the content wrapper.
    // Inside wrapper, we use local Y.
    let localY = 0;

    if (state.content.asciiArt) {
      const artLines = state.content.asciiArt.split("\n");
      const artLineHeight = 14;
      artLines.forEach((line, i) => {
        const y = localY + i * artLineHeight;
        innerContent += `<text x="0" y="${y}" class="terminal-text" fill="${theme.colors.dragonBlue}" font-family="monospace" font-size="12" xml:space="preserve">${line}</text>`;
      });
      localY += artLines.length * artLineHeight + 20;
    }

    // 4.1 Developer Info
    // renderDeveloperInfo returns <g> with internal y=0..40.
    // We need to wrap it or modify it to accept Y.
    // Earlier I didn't update renderDeveloperInfo to accept Y, just added param check?
    // Let's modify renderDeveloperInfo to return string with transform or just wrap it here.
    innerContent += `<g transform="translate(0, ${localY})">${renderDeveloperInfo(state.content.developerInfo, theme)}</g>`;
    // Approx height of dev info is 3 lines * 20 = 60.
    localY += 60 + 20; // + Padding

    // 4.2 Tech Stack
    // renderTechStack accepts x,y.
    innerContent += renderTechStack(state.content.techStack, theme, 0, localY);
    // Height is unknown? "localY" logic in renderTechStack builds vertically.
    // We need to know height to offset next item.
    // renderTechStack doesn't return height.
    // Phase 1 layout relied on hardcoded or loose "flow".
    // 4.3 Language Stats relies on fixed Y?
    // In Phase 1 code:
    // innerContent += renderTechStack(..., 0, 60) relative to previous.
    // innerContent += renderLanguageStats(..., 140) global offset? No, relative to content wrapper.
    // If I use dynamic "localY", I need to know height of previous components!
    // Since I don't calculate height, I must rely on ESTIMATES or renderers returning height.
    // For Phase 2 Polish, I should probably standardize this.
    // BUT for ASCII art, I know height.
    // Developer Info height is fixed (3 lines).
    // Tech Stack height depends on items.
    // Let's assume standard height for Tech Stack for now or calculate it?
    // TechStack has categories * (title + items).
    // Let's ESTIMATE generic height for now to keep it simple, as renderTechStack is complex.
    // Or better: update renderers to return height? Too big refactor.
    // I'll stick to Previous logic for elements below DevInfo?
    // Previous logic:
    // TechStack at logic 0, 60 (relative to what? DevInfo?)
    // In previous code:
    // 4.1 DevInfo (returns content at 0, 20, 40)
    // 4.2 TechStack(..., 0, 60). (Starts at 60, overlap if DevInfo > 60?)
    // 4.3 LangStats(..., 140). (Starts at 140).
    // So if I insert ASCII, I just need to shift EVERYTHING by ASCII height.

    // NEW LOGIC:
    // contentStartY = 140 (base) + ASCII_HEIGHT.
    // Everything else remains RELATIVE to 0 inside content area, so they just shift down together.
    // Exception: If I render ASCII *inside* content area at top, I push existing items.
    // If I render ASCII *outside* content area?
    // Let's render ASCII *inside* content area at Y=0, and shift DevInfo (currently at 0) down?
    // Yes.
    // But DevInfo doesn't accept Y offset and renders at 0.
    // So I wrap DevInfo in <g transform="translate(0, asciiOffset)">.
    // TechStack was at 60. Shift to 60 + asciiOffset.
    // LangStats was at 140. Shift to 140 + asciiOffset.
    // RecentCommits was at (400, 60). Shift Y to 60 + asciiOffset.
    // Engagement was at 200. Shift to 200 + asciiOffset.
    // Contact at 280. Shift to 280 + asciiOffset.

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

    innerContent += asciiSvg;

    // 4.1 Dev Info
    // Wrap in transform
    innerContent += `<g transform="translate(0, ${contentOffset})">${renderDeveloperInfo(state.content.developerInfo, theme)}</g>`;

    // 4.2 Tech Stack
    // Was 0, 60. New: 0, 60+offset.
    innerContent += renderTechStack(
      state.content.techStack,
      theme,
      0,
      60 + contentOffset,
    );

    // 4.3 Lang Stats
    // Was 140. New 140+offset.
    innerContent += renderLanguageStats(
      state.content.languageStats,
      theme,
      140 + contentOffset,
    );

    // 4.4 Recent Commits
    // Was 400, 60. New 400, 60+offset.
    innerContent += renderRecentCommits(
      state.content.recentCommits,
      theme,
      400,
      60 + contentOffset,
    );

    // 4.5 Engagement
    // Was 200.
    innerContent += renderEngagement(state.content, theme, 200 + contentOffset);

    // 4.6 Contact
    // Was 280.
    innerContent += renderContact(
      state.content.contactInfo,
      theme,
      280 + contentOffset,
    );

    builder.addLayer(renderContentArea(contentStartY, innerContent));

    // 5. Footer
    builder.addLayer(
      renderFooter("Powered by Terminal Profile", theme, width, height),
    );

    return builder.build();
  }
}
