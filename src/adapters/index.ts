import type { ClockPort } from "../domain/ports/clock.port";
import type { EnvironmentPort } from "../domain/ports/environment.port";
import type { FileSystemPort } from "../domain/ports/file-system.port";
import type { GitHubDataPort } from "../domain/ports/github-data.port";
import type { LoggerPort } from "../domain/ports/logger.port";
import type { ProcessPort } from "../domain/ports/process.port";
import { createSystemClockAdapter } from "./infrastructure/clock.adapter";
import { createConsoleLoggerAdapter } from "./infrastructure/console-logger.adapter";
import { createNodeFileSystemAdapter } from "./infrastructure/file-system.adapter";
import { createMockGitHubAdapter } from "./infrastructure/github.adapter";
import { createGitHubApiAdapter } from "./infrastructure/github-api.adapter";
import { createNodeEnvironmentAdapter } from "./infrastructure/node-environment.adapter";
import { createNodeProcessAdapter } from "./infrastructure/node-process.adapter";

export interface Ports {
  readonly github: GitHubDataPort;
  readonly clock: ClockPort;
  readonly fileSystem: FileSystemPort;
  readonly logger: LoggerPort;
  readonly environment: EnvironmentPort;
  readonly process: ProcessPort;
}

export function createPorts(githubToken: string | undefined): Ports {
  return {
    github: githubToken ? createGitHubApiAdapter(githubToken) : createMockGitHubAdapter(),
    clock: createSystemClockAdapter(),
    fileSystem: createNodeFileSystemAdapter(),
    logger: createConsoleLoggerAdapter(),
    environment: createNodeEnvironmentAdapter(),
    process: createNodeProcessAdapter(),
  };
}
