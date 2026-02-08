import { parse } from "yaml";
import { err, ok, type Result } from "../shared/result";
import { type Config, ConfigSchema } from "./schema";

export type ConfigError = {
  readonly type: "parse" | "validation";
  readonly message: string;
  readonly details?: unknown;
};

export function loadConfigFromString(yaml: string): Result<Config, ConfigError> {
  let raw: unknown;
  try {
    raw = parse(yaml);
  } catch (error) {
    return err({
      type: "parse",
      message: "Failed to parse YAML",
      details: error,
    });
  }

  const result = ConfigSchema.safeParse(raw);
  if (!result.success) {
    return err({
      type: "validation",
      message: result.error.issues.map((i) => i.message).join(", "),
      details: result.error.issues,
    });
  }

  return ok(result.data);
}
