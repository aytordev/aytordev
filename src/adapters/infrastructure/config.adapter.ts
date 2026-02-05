import * as fs from "fs/promises";
import { loadConfigFromString } from "../../config/loader";
import type { Config } from "../../config/schema";
import type { ConfigPort } from "../../domain/ports/config.port";
import { type Result, err } from "../../shared/result";

export class FileConfigAdapter implements ConfigPort {
  async load(path: string): Promise<Result<Config, Error>> {
    try {
      const content = await fs.readFile(path, "utf-8");
      const result = loadConfigFromString(content);
      if (!result.ok) {
        return err(new Error(`[${result.error.type}] ${result.error.message}`));
      }
      return result;
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
