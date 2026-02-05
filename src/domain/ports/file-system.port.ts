export interface FileSystemPort {
  exists(path: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
}
