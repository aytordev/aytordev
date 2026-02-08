import { describe, expect, it } from "vitest";
import { createOwner } from "../../../domain/value-objects/owner";

describe("createOwner", () => {
  it("should create valid Owner", () => {
    const result = createOwner({
      name: "John Doe",
      username: "johndoe",
      title: "Developer",
      location: "Earth",
      timezone: "UTC",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.username).toBe("johndoe");
      expect(result.value.name).toBe("John Doe");
      expect(result.value.title).toBe("Developer");
      expect(result.value.location).toBe("Earth");
      expect(result.value.timezone).toBe("UTC");
    }
  });

  it("should trim whitespace from fields", () => {
    const result = createOwner({
      name: "  John Doe  ",
      username: "  johndoe  ",
      title: "  Developer  ",
      location: "  Earth  ",
      timezone: "  UTC  ",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.username).toBe("johndoe");
      expect(result.value.name).toBe("John Doe");
    }
  });

  it("should reject empty username", () => {
    const result = createOwner({
      name: "John Doe",
      username: "",
      title: "Developer",
      location: "Earth",
      timezone: "UTC",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Username cannot be empty");
    }
  });

  it("should reject username over 39 characters", () => {
    const result = createOwner({
      name: "John Doe",
      username: "a".repeat(40),
      title: "Developer",
      location: "Earth",
      timezone: "UTC",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("39 character limit");
    }
  });

  it("should reject invalid username characters", () => {
    const result = createOwner({
      name: "John Doe",
      username: "john@doe",
      title: "Developer",
      location: "Earth",
      timezone: "UTC",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("invalid characters");
    }
  });

  it("should reject empty name", () => {
    const result = createOwner({
      name: "",
      username: "johndoe",
      title: "Developer",
      location: "Earth",
      timezone: "UTC",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Name cannot be empty");
    }
  });

  it("should reject empty title", () => {
    const result = createOwner({
      name: "John Doe",
      username: "johndoe",
      title: "",
      location: "Earth",
      timezone: "UTC",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Title cannot be empty");
    }
  });

  it("should reject empty location", () => {
    const result = createOwner({
      name: "John Doe",
      username: "johndoe",
      title: "Developer",
      location: "",
      timezone: "UTC",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Location cannot be empty");
    }
  });

  it("should reject empty timezone", () => {
    const result = createOwner({
      name: "John Doe",
      username: "johndoe",
      title: "Developer",
      location: "Earth",
      timezone: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Timezone cannot be empty");
    }
  });
});
