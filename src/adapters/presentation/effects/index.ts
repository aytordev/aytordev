import type { Theme } from "../../../../theme/types";
import { createGlowFilter } from "./glow";
import { createSkillGradient } from "./gradients";

// Since we haven't defined Config types in domain yet (they are in schema),
// we might need to import from config or just accept a simplified interface here.
// But we should stick to domain/pure concepts if possible.
// However, effects config is part of Infrastructure/Config/External usually,
// but passed as params.
// Let's assume a simple interface for now or iterate if Config is available.
// Spec says: buildDefs(theme, config.effects)

interface EffectsConfig {
  gradient_bars: boolean;
  subtle_glow: boolean;
}

export const buildDefs = (theme: Theme, effects: EffectsConfig): string => {
  const defs: string[] = [];

  if (effects.gradient_bars) {
    // Spec 6.1 example had id="skill-gradient-0"
    // Let's create a default one or a few
    defs.push(
      createSkillGradient(
        "skill-gradient-0",
        theme.colors.springBlue,
        theme.colors.oniViolet,
      ),
    );
  }

  if (effects.subtle_glow) {
    defs.push(createGlowFilter("glow"));
  }

  return defs.join("\n");
};
