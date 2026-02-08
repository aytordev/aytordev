import { type Result, ok, err } from "../../shared/result";

export type CommitType = "feat" | "fix" | "docs" | "style" | "refactor" | "test" | "chore";

export interface Commit {
  readonly hash: string;
  readonly message: string;
  readonly emoji: string;
  readonly type: CommitType;
  readonly relativeTime: string;
}

/**
 * Creates a validated Commit value object.
 */
export const createCommit = (data: {
  hash: string;
  message: string;
  emoji: string;
  type: CommitType;
  relativeTime: string;
}): Result<Commit, Error> => {
  // Validate hash (Git short hash: 7-40 hex characters)
  if (!data.hash || data.hash.trim() === "") {
    return err(new Error("Commit hash cannot be empty"));
  }

  if (!/^[0-9a-f]{7,40}$/i.test(data.hash)) {
    return err(new Error("Invalid commit hash format"));
  }

  // Validate message
  if (!data.message || data.message.trim() === "") {
    return err(new Error("Commit message cannot be empty"));
  }

  // Validate type
  const validTypes: CommitType[] = ["feat", "fix", "docs", "style", "refactor", "test", "chore"];
  if (!validTypes.includes(data.type)) {
    return err(new Error(`Invalid commit type: ${data.type}`));
  }

  // Validate relativeTime
  if (!data.relativeTime || data.relativeTime.trim() === "") {
    return err(new Error("Relative time cannot be empty"));
  }

  // Return validated value object
  return ok({
    hash: data.hash.trim(),
    message: data.message.trim(),
    emoji: data.emoji.trim(),
    type: data.type,
    relativeTime: data.relativeTime.trim(),
  });
};
