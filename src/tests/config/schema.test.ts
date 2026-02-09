import { describe, expect, it } from "vitest";
import {
  ConfigSchema,
  ContactSchema,
  FeaturedReposConfigSchema,
  JourneyEntrySchema,
  SystemInfoSchema,
} from "../../config/schema";

const validOwner = {
  name: "Test User",
  username: "testuser",
  title: "Developer",
  location: "Earth",
  timezone: "UTC",
};

const validSystem = {
  os: "NixOS",
  shell: "zsh",
  editor: "neovim",
  terminal: "ghostty",
  theme: "Kanagawa",
};

const validJourney = [
  { year: 2020, icon: "🌱", title: "Started coding" },
  { year: 2024, icon: "🤖", title: "AI Engineering", tags: ["LLMs", "Agents"] },
];

const minimalValidConfig = {
  version: 2,
  owner: validOwner,
  system: validSystem,
  journey: validJourney,
};

describe("Config Schema v2", () => {
  describe("ConfigSchema", () => {
    it("should validate a minimal valid v2 config", () => {
      const result = ConfigSchema.safeParse(minimalValidConfig);
      expect(result.success).toBe(true);
    });

    it("should reject version 1", () => {
      const result = ConfigSchema.safeParse({ ...minimalValidConfig, version: 1 });
      expect(result.success).toBe(false);
    });

    it("should reject config with missing owner", () => {
      const result = ConfigSchema.safeParse({ version: 2, system: validSystem, journey: [] });
      expect(result.success).toBe(false);
    });

    it("should reject config with missing system", () => {
      const result = ConfigSchema.safeParse({ version: 2, owner: validOwner, journey: [] });
      expect(result.success).toBe(false);
    });

    it("should reject config with missing journey", () => {
      const result = ConfigSchema.safeParse({ version: 2, owner: validOwner, system: validSystem });
      expect(result.success).toBe(false);
    });

    it("should apply default values", () => {
      const result = ConfigSchema.safeParse(minimalValidConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.theme).toBe("kanagawa-wave");
        expect(result.data.profile_mode).toBe("story-driven");
        expect(result.data.dimensions).toBeUndefined();
        expect(result.data.effects).toBeUndefined();
        expect(result.data.contact).toBeUndefined();
        expect(result.data.featured_repos).toBeUndefined();
      }
    });

    it("should validate theme enum", () => {
      const result = ConfigSchema.safeParse({
        ...minimalValidConfig,
        theme: "invalid-theme",
      });
      expect(result.success).toBe(false);
    });

    it("should accept all valid theme variants", () => {
      for (const theme of ["kanagawa-wave", "kanagawa-dragon", "kanagawa-lotus"]) {
        const result = ConfigSchema.safeParse({ ...minimalValidConfig, theme });
        expect(result.success).toBe(true);
      }
    });

    it("should reject unknown fields in strict mode", () => {
      const result = ConfigSchema.safeParse({
        ...minimalValidConfig,
        unknown_field: "value",
      });
      expect(result.success).toBe(false);
    });

    it("should accept full config with all optional sections", () => {
      const fullConfig = {
        ...minimalValidConfig,
        theme: "kanagawa-dragon",
        dimensions: { width: 800, height: 1000 },
        tmux: { session_name: "dev", windows: ["zsh", "nvim"], show_stats: true },
        tech_stack: { categories: [{ name: "Languages", items: ["TypeScript", "Rust"] }] },
        featured_repos: { source: "pinned", limit: 3 },
        contact: { cta: "Let's connect!", items: [{ label: "gh", value: "@test" }] },
        effects: { cursor_blink: true, gradient_bars: true, subtle_glow: false },
        github: { max_repos: 10, include_private: false },
        animation: { enabled: true, speed: 1.0, initialDelay: 0.5 },
      };
      const result = ConfigSchema.safeParse(fullConfig);
      expect(result.success).toBe(true);
    });
  });

  describe("SystemInfoSchema", () => {
    it("should validate valid system info", () => {
      const result = SystemInfoSchema.safeParse(validSystem);
      expect(result.success).toBe(true);
    });

    it("should accept optional wm field", () => {
      const result = SystemInfoSchema.safeParse({ ...validSystem, wm: "yabai" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wm).toBe("yabai");
      }
    });

    it("should validate without wm field", () => {
      const result = SystemInfoSchema.safeParse(validSystem);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wm).toBeUndefined();
      }
    });

    it("should reject empty os", () => {
      const result = SystemInfoSchema.safeParse({ ...validSystem, os: "" });
      expect(result.success).toBe(false);
    });

    it("should reject os exceeding max length", () => {
      const result = SystemInfoSchema.safeParse({ ...validSystem, os: "x".repeat(31) });
      expect(result.success).toBe(false);
    });
  });

  describe("JourneyEntrySchema", () => {
    it("should validate valid journey entry", () => {
      const result = JourneyEntrySchema.safeParse({
        year: 2020,
        icon: "🌱",
        title: "Started coding",
      });
      expect(result.success).toBe(true);
    });

    it("should validate entry with tags", () => {
      const result = JourneyEntrySchema.safeParse({
        year: 2024,
        icon: "🤖",
        title: "AI Engineering",
        tags: ["LLMs", "Agents", "Claude"],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual(["LLMs", "Agents", "Claude"]);
      }
    });

    it("should reject year below 1900", () => {
      const result = JourneyEntrySchema.safeParse({ year: 1899, icon: "📅", title: "Too old" });
      expect(result.success).toBe(false);
    });

    it("should reject year above 2100", () => {
      const result = JourneyEntrySchema.safeParse({ year: 2101, icon: "📅", title: "Too far" });
      expect(result.success).toBe(false);
    });

    it("should reject empty icon", () => {
      const result = JourneyEntrySchema.safeParse({ year: 2020, icon: "", title: "No icon" });
      expect(result.success).toBe(false);
    });

    it("should reject empty title", () => {
      const result = JourneyEntrySchema.safeParse({ year: 2020, icon: "🌱", title: "" });
      expect(result.success).toBe(false);
    });

    it("should reject more than 5 tags", () => {
      const result = JourneyEntrySchema.safeParse({
        year: 2020,
        icon: "🌱",
        title: "Test",
        tags: ["a", "b", "c", "d", "e", "f"],
      });
      expect(result.success).toBe(false);
    });

    it("should reject more than 10 journey entries in config", () => {
      const entries = Array.from({ length: 11 }, (_, i) => ({
        year: 2020 + i,
        icon: "📅",
        title: `Entry ${i}`,
      }));
      const result = ConfigSchema.safeParse({
        ...minimalValidConfig,
        journey: entries,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("FeaturedReposConfigSchema", () => {
    it("should apply defaults", () => {
      const result = FeaturedReposConfigSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.source).toBe("stars");
        expect(result.data.limit).toBe(3);
      }
    });

    it("should accept pinned source", () => {
      const result = FeaturedReposConfigSchema.safeParse({ source: "pinned", limit: 5 });
      expect(result.success).toBe(true);
    });

    it("should reject invalid source", () => {
      const result = FeaturedReposConfigSchema.safeParse({ source: "forks" });
      expect(result.success).toBe(false);
    });

    it("should reject limit above 5", () => {
      const result = FeaturedReposConfigSchema.safeParse({ limit: 6 });
      expect(result.success).toBe(false);
    });

    it("should reject limit below 1", () => {
      const result = FeaturedReposConfigSchema.safeParse({ limit: 0 });
      expect(result.success).toBe(false);
    });
  });

  describe("ContactSchema", () => {
    it("should apply default cta", () => {
      const result = ContactSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cta).toBe("Let's connect! 💬");
        expect(result.data.items).toEqual([]);
      }
    });

    it("should accept custom cta", () => {
      const result = ContactSchema.safeParse({ cta: "Reach out!" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cta).toBe("Reach out!");
      }
    });

    it("should accept items with all fields", () => {
      const result = ContactSchema.safeParse({
        items: [{ label: "GitHub", value: "@test", icon: "gh" }],
      });
      expect(result.success).toBe(true);
    });

    it("should reject more than 4 contact items", () => {
      const items = Array.from({ length: 5 }, (_, i) => ({
        label: `L${i}`,
        value: `V${i}`,
      }));
      const result = ContactSchema.safeParse({ items });
      expect(result.success).toBe(false);
    });
  });
});
