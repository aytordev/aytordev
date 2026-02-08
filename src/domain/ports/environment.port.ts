export interface EnvironmentPort {
  readonly get: (key: string) => string | undefined;
  readonly cwd: () => string;
  readonly nodeVersion: () => string;
}
