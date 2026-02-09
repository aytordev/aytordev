import { describe, expect, it } from "vitest";
import { loadConfigFromString } from "../../config/loader";

describe("Config Loader", () => {
  describe("loadConfigFromString", () => {
    it("should parse valid v2 YAML config", () => {
      const yaml = `
version: 2
owner:
  name: Test User
  username: testuser
  title: Developer
  location: Earth
  timezone: UTC
system:
  os: NixOS
  shell: zsh
  editor: neovim
  terminal: ghostty
  theme: Kanagawa
journey:
  - year: 2020
    icon: "🌱"
    title: Started coding
`;
      const result = loadConfigFromString(yaml);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe(2);
        expect(result.value.owner.name).toBe("Test User");
        expect(result.value.owner.username).toBe("testuser");
        expect(result.value.system.os).toBe("NixOS");
        expect(result.value.journey).toHaveLength(1);
        expect(result.value.journey[0].year).toBe(2020);
      }
    });

    it("should return error for v1 config", () => {
      const yaml = `
version: 1
owner:
  name: Test
  username: test
  title: Dev
  location: Earth
  timezone: UTC
`;
      const result = loadConfigFromString(yaml);
      expect(result.ok).toBe(false);
    });

    it("should return error for malformed YAML", () => {
      const malformedYaml = `
version: 2
owner:
  name: [invalid
`;
      const result = loadConfigFromString(malformedYaml);
      expect(result.ok).toBe(false);
    });
  });
});
