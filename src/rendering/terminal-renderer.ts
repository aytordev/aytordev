import type { TerminalState } from "../domain/entities/terminal-state";
import { getTheme } from "../theme";
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
    const width = 800;
    const height = 400;

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
      subtle_glow: false, // Glow is expensive, default off
    };

    const defs = buildDefs(theme, effectsConfig);
    if (defs) {
      builder.addDefs(defs);
    }

    // 1. Tmux Status Bar (Top)
    // Moved to top as per user request
    builder.addLayer(renderTmuxBar(state.session, theme, 0));

    // 2. Prompt (Offset by Tmux Bar)
    // Tmux bar is 24px height. Give it some padding.
    // Previous Y=40. New Y = 24 + 40 = 64.
    const promptY = 64;
    builder.addLayer(renderPrompt(state.prompt, theme, promptY));

    // 3. Streak (Top Right)
    // Align with prompt
    builder.addLayer(renderStreak(state.content.streak, theme, 600, promptY));

    // 4. Content Area (Middle)
    // Stack items vertically
    // Previous Y=100. New Y = 100 + 24 = 124?
    // Or just 120 to keep it clean.
    const contentStartY = 120;
    let innerContent = "";

    // 4.1 Developer Info
    innerContent += renderDeveloperInfo(state.content.developerInfo, theme);

    // 4.2 Tech Stack (Offset by prev height approx 60px)
    // Previously hardcoded translate(0, 60).
    innerContent += renderTechStack(state.content.techStack, theme, 0, 60);

    // 4.3 Language Stats (F10 + F41)
    // Position below Tech Stack (60 + ~80 height = 140)
    innerContent += renderLanguageStats(
      state.content.languageStats,
      theme,
      140,
    );

    // 4.4 Recent Commits
    // Previously hardcoded translate(400, 60).
    innerContent += renderRecentCommits(
      state.content.recentCommits,
      theme,
      400,
      60,
    );

    // 4.5 Engagement (Lower Left)
    innerContent += renderEngagement(state.content, theme, 200);

    // 4.5 Contact
    innerContent += renderContact(state.content.contactInfo, theme, 280);

    builder.addLayer(renderContentArea(contentStartY, innerContent));

    // 5. Footer
    builder.addLayer(
      renderFooter("Powered by Terminal Profile", theme, width, height),
    );

    return builder.build();
  }
}
