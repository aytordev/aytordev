import type { Ports } from "../../adapters";
import type { Config } from "../../config/schema";
import type { TerminalState } from "../../domain/entities/terminal-state";
import type { GenerateShareCardUseCase } from "../../domain/use-cases/generate-share-card";
import { map, type Result } from "../../shared/result";

import { createGenerateProfileUseCase } from "./generate-profile";

// Share Card Use Case implies generating a profile but with overrides.
// We can reuse generate-profile logic and just override the result state?
// Or create a wrapper.

export const createGenerateShareCardUseCase = (ports: Ports): GenerateShareCardUseCase => {
  const generateBase = createGenerateProfileUseCase(ports);

  return async (config: Config): Promise<Result<TerminalState, Error>> => {
    // Override config for Share Card
    const shareConfig: Config = {
      ...config,
      dimensions: { width: 1200, height: 630 },
      // We might want to adjust content limits for larger card?
      // For now keep same content, just bigger canvas and static.
    };

    const result = await generateBase(shareConfig);

    return map(result, (state) => ({
      ...state,
      renderOptions: {
        disableAnimations: true,
      },
      // Ensure dimensions are enforced if generateBase didn't pick up correctly (it should have)
      dimensions: { width: 1200, height: 630 },
    }));
  };
};
