import * as fs from "fs/promises";
import type { FileSystemPort } from "../../domain/ports/file-system.port";

export const createNodeFileSystemAdapter = (): FileSystemPort => ({
  exists: async (path: string): Promise<boolean> => {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  },

  readFile: async (filePath: string): Promise<string> => fs.readFile(filePath, "utf-8"),

  writeFile: async (filePath: string, content: string): Promise<void> => {
    await fs.writeFile(filePath, content, "utf-8");
  },
});
