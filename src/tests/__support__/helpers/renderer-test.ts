/**
 * Helpers for testing renderer functions
 */

import type { TerminalState } from "../../../domain/entities/terminal-state";
import type { Theme } from "../../../theme/types";
import { createMockTheme } from "../../mocks/theme";
import { terminalStateBuilder } from "../builders/terminal-state.builder";

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
