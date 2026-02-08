/**
 * Animation configuration value object.
 *
 * Represents the configuration for terminal session animation.
 * This is an immutable value object following DDD principles.
 *
 * @property enabled - Whether animation is enabled
 * @property speed - Animation speed multiplier (0.1 = very slow, 1 = normal, 5 = very fast)
 * @property initialDelay - Delay in seconds before animation starts (0 to 10)
 *
 * @example
 * ```typescript
 * const config: AnimationConfig = {
 *   enabled: true,
 *   speed: 1,
 *   initialDelay: 0.5,
 * };
 * ```
 */
export interface AnimationConfig {
  readonly enabled: boolean;
  readonly speed: number; // Range: 0.1 to 5
  readonly initialDelay: number; // Range: 0 to 10 seconds
}
