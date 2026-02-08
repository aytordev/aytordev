import type { ClockPort } from "../domain/ports/clock.port";
import type { EnvironmentPort } from "../domain/ports/environment.port";
import type { FileSystemPort } from "../domain/ports/file-system.port";
import type { GitHubDataPort } from "../domain/ports/github-data.port";
import type { LoggerPort } from "../domain/ports/logger.port";
import type { ProcessPort } from "../domain/ports/process.port";
import { SystemClockAdapter } from "./infrastructure/clock.adapter";
import { createConsoleLoggerAdapter } from "./infrastructure/console-logger.adapter";
import { NodeFileSystemAdapter } from "./infrastructure/file-system.adapter";
import { MockGitHubAdapter } from "./infrastructure/github.adapter";
import { GitHubApiAdapter } from "./infrastructure/github-api.adapter";
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
    github: githubToken ? new GitHubApiAdapter(githubToken) : new MockGitHubAdapter(),
    clock: new SystemClockAdapter(),
    fileSystem: new NodeFileSystemAdapter(),
    logger: createConsoleLoggerAdapter(),
    environment: createNodeEnvironmentAdapter(),
    process: createNodeProcessAdapter(),
  };
}
