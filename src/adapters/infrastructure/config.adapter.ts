import { loadConfigFromString } from "../../config/loader";
import type { Config } from "../../config/schema";
import type { ConfigPort } from "../../domain/ports/config.port";
import type { FileSystemPort } from "../../domain/ports/file-system.port";
import { err, type Result } from "../../shared/result";

export const createFileConfigAdapter = (fileSystem: FileSystemPort): ConfigPort => ({
  load: async (path: string): Promise<Result<Config, Error>> => {
    try {
      const content = await fileSystem.readFile(path);
      const result = loadConfigFromString(content);
      if (!result.ok) {
        return err(new Error(`[${result.error.type}] ${result.error.message}`));
      }
      return result;
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  },
});
