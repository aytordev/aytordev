import { describe, expect, it } from "vitest";
import { createCommit } from "../../../domain/value-objects/commit";

describe("createCommit", () => {
  it("should create valid Commit", () => {
    const result = createCommit({
      hash: "abc1234",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hash).toBe("abc1234");
      expect(result.value.message).toBe("feat: initial commit");
      expect(result.value.emoji).toBe("🎉");
      expect(result.value.type).toBe("feat");
      expect(result.value.relativeTime).toBe("2 hours ago");
    }
  });

  it("should accept full-length hash (40 characters)", () => {
    const fullHash = "a".repeat(40);
    const result = createCommit({
      hash: fullHash,
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hash).toBe(fullHash);
    }
  });

  it("should accept short hash (7 characters)", () => {
    const result = createCommit({
      hash: "abc1234",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hash).toBe("abc1234");
    }
  });

  it("should reject empty hash", () => {
    const result = createCommit({
      hash: "",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("hash cannot be empty");
    }
  });

  it("should reject invalid hash format", () => {
    const result = createCommit({
      hash: "xyz",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Invalid commit hash");
    }
  });

  it("should reject empty message", () => {
    const result = createCommit({
      hash: "abc1234",
      message: "",
      emoji: "🎉",
      type: "feat",
      relativeTime: "2 hours ago",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("message cannot be empty");
    }
  });

  it("should reject invalid commit type", () => {
    const result = createCommit({
      hash: "abc1234",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "invalid" as any,
      relativeTime: "2 hours ago",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Invalid commit type");
    }
  });

  it("should accept all valid commit types", () => {
    const types = ["feat", "fix", "docs", "style", "refactor", "test", "chore"];

    for (const type of types) {
      const result = createCommit({
        hash: "abc1234",
        message: `${type}: test`,
        emoji: "🎉",
        type: type as any,
        relativeTime: "2 hours ago",
      });

      expect(result.ok).toBe(true);
    }
  });

  it("should reject empty relativeTime", () => {
    const result = createCommit({
      hash: "abc1234",
      message: "feat: initial commit",
      emoji: "🎉",
      type: "feat",
      relativeTime: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Relative time cannot be empty");
    }
  });
});
