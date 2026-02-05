import type { Dimensions, Owner } from "../../config/schema"; // We can reuse Owner type from config or define domain one
import type { EasterEggType } from "../value-objects/easter-egg";
import type { TimeOfDay } from "../value-objects/time-of-day";
import type { StarshipPrompt } from "./starship-prompt";
import type { TerminalContent } from "./terminal-content";
import type { TmuxSession } from "./tmux-session";

export interface TerminalState {
  readonly timestamp: Date;
  readonly timeOfDay: TimeOfDay;
  readonly greeting: string;
  readonly owner: Owner;
  readonly session: TmuxSession;
  readonly prompt: StarshipPrompt;
  readonly content: TerminalContent;
  readonly themeName: string; // Using simple string to decouple from Theme implementation details
  readonly dimensions: Dimensions;
  readonly easterEgg?: EasterEggType;
}
