export type CommitType =
  | "feat"
  | "fix"
  | "docs"
  | "style"
  | "refactor"
  | "test"
  | "chore";

export interface Commit {
  readonly hash: string;
  readonly message: string;
  readonly emoji: string;
  readonly type: CommitType;
  readonly relativeTime: string;
}
