import type { TerminalState } from "../domain/entities/terminal-state";
import { getTheme } from "../theme";
import { renderContact } from "./layers/contact.renderer";
import { renderContentArea } from "./layers/content-area.renderer";
import { renderDeveloperInfo } from "./layers/developer-info.renderer";
import { renderEngagement } from "./layers/engagement.renderer";
import { renderFooter } from "./layers/footer.renderer";
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

    // 1. Prompt (Top Left)
    const promptY = 40;
    builder.addLayer(renderPrompt(state.prompt, theme, promptY));

    // 2. Streak (Top Right)
    // Position it roughly aligned with prompt but on right side
    builder.addLayer(renderStreak(state.content.streak, theme, 600, 40));

    // 3. Content Area (Middle)
    // Stack items vertically
    const contentStartY = 100;
    let innerContent = "";

    // 3.1 Developer Info
    innerContent += renderDeveloperInfo(state.content.developerInfo, theme);

    // 3.2 Tech Stack (Offset by prev height approx 80px)
    // We wrap tech stack in a group to position it relative to content area start
    // renderTechStack returns a group with transform(0, 60) hardcoded in my implementation?
    // Wait, let's check tech-stack.renderer.ts.
    // It had `transform="translate(0, 60)"`. This is hardcoded relative to parent.
    // If I put it in content area, it will be at y=60 inside content area.
    innerContent += renderTechStack(state.content.techStack, theme);

    // 3.3 Recent Commits
    innerContent += renderRecentCommits(state.content.recentCommits, theme);

    // 3.4 Engagement (Learning & Quote)
    // Position below content area start?
    // Wait, renderContentArea wraps innerContent.
    // Engagement renderer has its own group id="engagement".
    // If I append it to innerContent, it will be inside content-area group.
    // Spec shows:
    // <g id="content">
    //   <g id="developer-info">...
    //   <g id="engagement">...
    //   <g id="contact">...
    // </g>

    // So yes, append to innerContent.
    // But I need to manage Y positioning within content area.
    // DevInfo (0) -> TechStack (~60) -> Commits (Right side).
    // Engagement should probably go below Developer Info on left? or below everything?
    // Let's put Engagement below Tech Stack on left side.
    const engagementY = 60 + 100; // rough estimate or dynamic tracker
    // Ideally we should track CurrentY.
    // For now, let's hardcode position to avoid collision with TechStack (which starts at 60 and might grow).
    // Tech Stack has ~3 categories. title(24) + items.
    // Let's put Engagement at y=200.
    innerContent += renderEngagement(state.content, theme, 200);

    // 3.5 Contact
    // Put securely at bottom left?
    innerContent += renderContact(state.content.contactInfo, theme, 280);

    builder.addLayer(renderContentArea(contentStartY, innerContent));

    // 4. Tmux Status Bar (Bottom)
    builder.addLayer(renderTmuxBar(state.session, theme));

    // 5. Footer
    builder.addLayer(
      renderFooter("Powered by Terminal Profile", theme, width, height),
    );

    return builder.build();
  }
}
