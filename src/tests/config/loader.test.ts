import { describe, expect, it } from "vitest";
import { loadConfigFromString } from "../../config/loader";

describe("Config Loader", () => {
  describe("loadConfigFromString", () => {
    it("should parse valid YAML config", () => {
      const yaml = `
version: 1
owner:
  name: Test User
  username: testuser
  title: Developer
  location: Earth
  timezone: UTC
`;
      const result = loadConfigFromString(yaml);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.owner.name).toBe("Test User");
        expect(result.value.owner.username).toBe("testuser");
      }
    });

    it("should return error for invalid YAML", () => {
      const invalidYaml = `
version: 2
owner:
  name: Test
`;
      const result = loadConfigFromString(invalidYaml);
      expect(result.ok).toBe(false);
    });

    it("should return error for malformed YAML", () => {
      const malformedYaml = `
version: 1
owner:
  name: [invalid
`;
      const result = loadConfigFromString(malformedYaml);
      expect(result.ok).toBe(false);
    });
  });
});
