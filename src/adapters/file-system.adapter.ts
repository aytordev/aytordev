import * as fs from "fs/promises";
import type { FileSystemPort } from "../domain/ports/file-system.port";

export class NodeFileSystemAdapter implements FileSystemPort {
  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async readFile(path: string): Promise<string> {
    return fs.readFile(path, "utf-8");
  }
}
