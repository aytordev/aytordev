/**
 * Builder for Config test objects
 * Provides fluent API for creating test configurations
 *
 * @example
 * ```typescript
 * const config = configBuilder()
 *   .withOwner({ username: "customuser" })
 *   .build();
 * ```
 */

import type { Config } from "../../../config/schema";
import { mockConfig } from "../../mocks/config";

export class ConfigBuilder {
  private config: Config;

  constructor() {
    // Start with mock config as base
    this.config = { ...mockConfig };
  }

  /**
   * Set owner (partial merge)
   */
  withOwner(owner: Partial<Config["owner"]>): this {
    this.config = {
      ...this.config,
      owner: { ...this.config.owner, ...owner },
    };
    return this;
  }

  /**
   * Set theme
   */
  withTheme(theme: string): this {
    this.config = {
      ...this.config,
      theme,
    };
    return this;
  }

  /**
   * Set dimensions
   */
  withDimensions(width: number, height: number): this {
    this.config = {
      ...this.config,
      dimensions: { width, height },
    };
    return this;
  }

  /**
   * Set animation configuration
   */
  withAnimation(animation: Config["animation"]): this {
    this.config = {
      ...this.config,
      animation,
    };
    return this;
  }

  /**
   * Deep merge any properties (use sparingly)
   */
  with(overrides: Partial<Config>): this {
    this.config = { ...this.config, ...overrides };
    return this;
  }

  /**
   * Build the final Config object
   */
  build(): Config {
    return this.config;
  }
}

/**
 * Factory function for creating a ConfigBuilder
 */
export const configBuilder = (): ConfigBuilder => new ConfigBuilder();
