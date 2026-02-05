import type { Config } from "../config/schema";
import type { ClockPort } from "../domain/ports/clock.port";
import type { FileSystemPort } from "../domain/ports/file-system.port";
import type { GitHubDataPort } from "../domain/ports/github-data.port";
import { SystemClockAdapter } from "./clock.adapter";
import { NodeFileSystemAdapter } from "./file-system.adapter";
import { GitHubApiAdapter } from "./github-api.adapter";
import { MockGitHubAdapter } from "./github.adapter";

export interface Ports {
  readonly github: GitHubDataPort;
  readonly clock: ClockPort;
  readonly fileSystem: FileSystemPort;
}

export function createPorts(config: Config): Ports {
  const githubToken = process.env.GITHUB_TOKEN;
  return {
    github: githubToken
      ? new GitHubApiAdapter(githubToken)
      : new MockGitHubAdapter(),
    clock: new SystemClockAdapter(),
    fileSystem: new NodeFileSystemAdapter(),
  };
}
