/**
 * Helpers for testing renderer functions
 */

import type { Theme } from "../../../theme/types";
import type { TerminalState } from "../../../domain/entities/terminal-state";
import { terminalStateBuilder } from "../builders/terminal-state.builder";
import { createMockTheme } from "../../mocks/theme";

export const rendererTest = {
  /**
   * Create a minimal context for renderer tests
   */
  createContext(): { state: TerminalState; theme: Theme } {
    return {
      state: terminalStateBuilder().build(),
      theme: createMockTheme(),
    };
  },

  /**
   * Create test context with custom state
   */
  createContextWithState(state: TerminalState): { state: TerminalState; theme: Theme } {
    return {
      state,
      theme: createMockTheme(),
    };
  },
};
