import { err, ok, type Result } from "../../shared/result";

export interface LanguageStat {
  readonly name: string;
  readonly percentage: number;
  readonly bytes: number;
  readonly color: string;
}

/**
 * Creates a validated LanguageStat value object.
 */
export const createLanguageStat = (data: {
  name: string;
  percentage: number;
  bytes: number;
  color: string;
}): Result<LanguageStat, Error> => {
  // Validate name
  if (!data.name || data.name.trim() === "") {
    return err(new Error("Language name cannot be empty"));
  }

  // Validate percentage (0-100)
  if (data.percentage < 0 || data.percentage > 100) {
    return err(new Error("Percentage must be between 0 and 100"));
  }

  // Validate bytes (non-negative)
  if (data.bytes < 0) {
    return err(new Error("Bytes cannot be negative"));
  }

  // Validate color (hex format)
  if (!/^#[0-9A-F]{6}$/i.test(data.color)) {
    return err(new Error("Color must be in hex format (#RRGGBB)"));
  }

  // Return validated value object
  return ok({
    name: data.name.trim(),
    percentage: data.percentage,
    bytes: data.bytes,
    color: data.color.toUpperCase(),
  });
};
