import { describe, expect, it } from "vitest";
import type { AnimationConfig } from "../../../domain/entities/animation-config";

describe("AnimationConfig", () => {
  describe("value object properties", () => {
    it("should be a readonly type", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 1,
        initialDelay: 0.5,
      };

      // TypeScript will enforce readonly at compile time
      expect(config.enabled).toBe(true);
      expect(config.speed).toBe(1);
      expect(config.initialDelay).toBe(0.5);
    });

    it("should allow all fields to be readonly", () => {
      const config: Readonly<AnimationConfig> = {
        enabled: false,
        speed: 2,
        initialDelay: 1,
      };

      expect(config).toEqual({
        enabled: false,
        speed: 2,
        initialDelay: 1,
      });
    });
  });

  describe("valid configurations", () => {
    it("should accept enabled:true with default speed", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 1,
        initialDelay: 0.5,
      };

      expect(config.enabled).toBe(true);
      expect(config.speed).toBe(1);
    });

    it("should accept slow speed (0.5)", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 0.5,
        initialDelay: 0.5,
      };

      expect(config.speed).toBe(0.5);
    });

    it("should accept fast speed (2.0)", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 2,
        initialDelay: 0.5,
      };

      expect(config.speed).toBe(2);
    });

    it("should accept maximum speed (5.0)", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 5,
        initialDelay: 0.5,
      };

      expect(config.speed).toBe(5);
    });

    it("should accept minimum speed (0.1)", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 0.1,
        initialDelay: 0.5,
      };

      expect(config.speed).toBe(0.1);
    });

    it("should accept initialDelay of 0", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 1,
        initialDelay: 0,
      };

      expect(config.initialDelay).toBe(0);
    });

    it("should accept initialDelay of 10", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 1,
        initialDelay: 10,
      };

      expect(config.initialDelay).toBe(10);
    });
  });

  describe("type safety", () => {
    it("should enforce readonly at compile-time", () => {
      const config: AnimationConfig = {
        enabled: true,
        speed: 1,
        initialDelay: 0.5,
      };

      // TypeScript prevents mutation at compile-time with readonly modifier
      // This is a type-level test - the following would not compile:
      // config.enabled = false; // ❌ Error: Cannot assign to 'enabled' because it is a read-only property

      // At runtime, we can only verify the value is set correctly
      expect(config.enabled).toBe(true);
      expect(config.speed).toBe(1);
      expect(config.initialDelay).toBe(0.5);
    });

    it("should be compatible with optional usage in TerminalState", () => {
      const stateWithAnimation: { readonly animation?: AnimationConfig } = {
        animation: {
          enabled: true,
          speed: 1,
          initialDelay: 0.5,
        },
      };

      expect(stateWithAnimation.animation).toBeDefined();
      expect(stateWithAnimation.animation?.enabled).toBe(true);
    });

    it("should allow undefined animation config", () => {
      const stateWithoutAnimation: { readonly animation?: AnimationConfig } = {
        animation: undefined,
      };

      expect(stateWithoutAnimation.animation).toBeUndefined();
    });
  });
});
