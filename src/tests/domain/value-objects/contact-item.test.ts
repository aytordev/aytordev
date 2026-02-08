import { describe, expect, it } from "vitest";
import { createContactItem } from "../../../domain/value-objects/contact-item";

describe("createContactItem", () => {
  it("should create valid ContactItem", () => {
    const result = createContactItem({
      label: "Email",
      value: "test@example.com",
      icon: "📧",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.label).toBe("Email");
      expect(result.value.value).toBe("test@example.com");
      expect(result.value.icon).toBe("📧");
    }
  });

  it("should trim whitespace from fields", () => {
    const result = createContactItem({
      label: "  Email  ",
      value: "  test@example.com  ",
      icon: "  📧  ",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.label).toBe("Email");
      expect(result.value.value).toBe("test@example.com");
      expect(result.value.icon).toBe("📧");
    }
  });

  it("should reject empty label", () => {
    const result = createContactItem({
      label: "",
      value: "test@example.com",
      icon: "📧",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("label cannot be empty");
    }
  });

  it("should reject empty value", () => {
    const result = createContactItem({
      label: "Email",
      value: "",
      icon: "📧",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("value cannot be empty");
    }
  });

  it("should reject empty icon", () => {
    const result = createContactItem({
      label: "Email",
      value: "test@example.com",
      icon: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("icon cannot be empty");
    }
  });
});
