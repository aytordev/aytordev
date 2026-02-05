export type GitStatus = "clean" | "dirty" | "behind" | "ahead" | "diverged";

export interface StarshipPrompt {
  readonly directory: string;
  readonly gitBranch: string | null;
  readonly gitStatus: GitStatus | null;
  readonly gitStats?: {
    readonly added: number;
    readonly deleted: number;
    readonly modified: number;
  };
  readonly nodeVersion: string | null;

  readonly nixIndicator: boolean;
  readonly time: string;
}
