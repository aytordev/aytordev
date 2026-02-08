import type { EnvironmentPort } from "../../domain/ports/environment.port";

export const createNodeEnvironmentAdapter = (): EnvironmentPort => ({
  get: (key: string) => process.env[key],
  cwd: () => process.cwd(),
  nodeVersion: () => process.version,
});
