/**
 * Builder for TerminalState test objects using fluent API
 * Provides sensible defaults and methods for common overrides
 *
 * @example
 * ```typescript
 * const state = terminalStateBuilder()
 *   .withDimensions(800, 600)
 *   .withAnimation({ enabled: true, speed: 2 })
 *   .build();
 * ```
 */

import type { AnimationConfig } from "../../../domain/entities/animation-config";
import type { TerminalState } from "../../../domain/entities/terminal-state";
import type { TerminalContent } from "../../../domain/entities/terminal-content";
import type { Owner } from "../../../config/schema";
import type { TimeOfDay } from "../../../domain/value-objects/time-of-day";
import { mockTerminalState } from "../../mocks/terminal-state";
import { TEST_DATES, TEST_DIMENSIONS } from "../constants";

export class TerminalStateBuilder {
  private state: TerminalState;

  constructor() {
    // Start with sensible defaults from mockTerminalState
    this.state = {
      ...mockTerminalState,
      dimensions: TEST_DIMENSIONS.DEFAULT,
      timestamp: TEST_DATES.DEFAULT,
    };
  }

  /**
   * Set terminal dimensions
   */
  withDimensions(width: number, height: number): this {
    this.state = {
      ...this.state,
      dimensions: { width, height },
    };
    return this;
  }

  /**
   * Set animation configuration
   */
  withAnimation(config: AnimationConfig): this {
    this.state = {
      ...this.state,
      animation: config,
    };
    return this;
  }

  /**
   * Set time of day
   */
  withTimeOfDay(timeOfDay: TimeOfDay): this {
    this.state = {
      ...this.state,
      timeOfDay,
    };
    return this;
  }

  /**
   * Set owner information (partial merge)
   */
  withOwner(owner: Partial<Owner>): this {
    this.state = {
      ...this.state,
      owner: { ...this.state.owner, ...owner },
    };
    return this;
  }

  /**
   * Set terminal content (partial merge)
   */
  withContent(content: Partial<TerminalContent>): this {
    this.state = {
      ...this.state,
      content: { ...this.state.content, ...content },
    };
    return this;
  }

  /**
   * Set theme name
   */
  withTheme(themeName: string): this {
    this.state = {
      ...this.state,
      themeName,
    };
    return this;
  }

  /**
   * Set timestamp
   */
  withTimestamp(timestamp: Date): this {
    this.state = {
      ...this.state,
      timestamp,
    };
    return this;
  }

  /**
   * Deep merge any properties (use sparingly, prefer specific methods)
   */
  with(overrides: Partial<TerminalState>): this {
    this.state = { ...this.state, ...overrides };
    return this;
  }

  /**
   * Build the final TerminalState object
   */
  build(): TerminalState {
    return this.state;
  }
}

/**
 * Factory function for creating a TerminalStateBuilder
 * Use this for cleaner imports
 */
export const terminalStateBuilder = (): TerminalStateBuilder =>
  new TerminalStateBuilder();
