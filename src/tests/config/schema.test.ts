import { describe, expect, it } from "vitest";
import { ConfigSchema } from "../../config/schema";

describe("Config Schema", () => {
  describe("ConfigSchema", () => {
    it("should validate a minimal valid config", () => {
      const minimalConfig = {
        version: 1,
        owner: {
          name: "Test User",
          username: "testuser",
          title: "Developer",
          location: "Earth",
          timezone: "UTC",
        },
      };

      const result = ConfigSchema.safeParse(minimalConfig);
      expect(result.success).toBe(true);
    });

    it("should reject config with missing owner", () => {
      const invalidConfig = {
        version: 1,
      };

      const result = ConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it("should reject invalid version", () => {
      const invalidConfig = {
        version: 2,
        owner: {
          name: "Test",
          username: "test",
          title: "Dev",
          location: "Earth",
          timezone: "UTC",
        },
      };

      const result = ConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it("should apply default values", () => {
      const minimalConfig = {
        version: 1,
        owner: {
          name: "Test User",
          username: "testuser",
          title: "Developer",
          location: "Earth",
          timezone: "UTC",
        },
      };

      const result = ConfigSchema.safeParse(minimalConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.theme).toBe("kanagawa-wave");
        // Optional sections are undefined when not provided
        expect(result.data.dimensions).toBeUndefined();
        expect(result.data.effects).toBeUndefined();
      }
    });

    it("should validate theme enum", () => {
      const config = {
        version: 1,
        owner: {
          name: "Test",
          username: "test",
          title: "Dev",
          location: "Earth",
          timezone: "UTC",
        },
        theme: "invalid-theme",
      };

      const result = ConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });
});
