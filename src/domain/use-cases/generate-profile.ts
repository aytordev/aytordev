import type { Config } from "../../config/schema";
import type { Result } from "../../shared/result";
import type { TerminalState } from "../entities/terminal-state";

export type GenerateProfileUseCase = (
  config: Config,
) => Promise<Result<TerminalState, Error>>;
