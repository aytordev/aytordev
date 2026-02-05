import type { Config } from "../../config/schema";
import type { Result } from "../../shared/result";

export interface ConfigPort {
  load(path: string): Promise<Result<Config, Error>>;
}
