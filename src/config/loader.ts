import { parse } from "yaml";
import { err, ok, type Result } from "../shared/result";
import { type Config, ConfigSchema } from "./schema";

export type ConfigError = {
  readonly type: "parse" | "validation";
  readonly message: string;
  readonly details?: unknown;
};

export const loadConfigFromString = (yaml: string): Result<Config, ConfigError> => {
  // Parse YAML using IIFE to avoid let mutation
  const parseResult = (() => {
    try {
      return ok(parse(yaml));
    } catch (error) {
      return err({
        type: "parse" as const,
        message: "Failed to parse YAML",
        details: error,
      });
    }
  })();

  if (!parseResult.ok) return parseResult;

  // Validate parsed data
  const result = ConfigSchema.safeParse(parseResult.value);
  if (!result.success) {
    return err({
      type: "validation",
      message: result.error.issues.map((i) => i.message).join(", "),
      details: result.error.issues,
    });
  }

  return ok(result.data);
};
