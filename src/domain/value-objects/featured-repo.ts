import { err, ok, type Result } from "../../shared/result";

export interface FeaturedRepo {
  readonly name: string;
  readonly nameWithOwner: string;
  readonly description?: string;
  readonly stargazerCount: number;
  readonly primaryLanguage?: {
    readonly name: string;
    readonly color: string;
  };
  readonly updatedAt: string;
}

export const createFeaturedRepo = (data: {
  name: string;
  nameWithOwner: string;
  description?: string;
  stargazerCount: number;
  primaryLanguage?: { name: string; color: string };
  updatedAt: string;
}): Result<FeaturedRepo, Error> => {
  if (!data.name || data.name.trim() === "") {
    return err(new Error("Repo name cannot be empty"));
  }

  if (!data.nameWithOwner || data.nameWithOwner.trim() === "") {
    return err(new Error("Repo nameWithOwner cannot be empty"));
  }

  if (data.stargazerCount < 0) {
    return err(new Error("Repo stargazerCount cannot be negative"));
  }

  return ok({
    name: data.name.trim(),
    nameWithOwner: data.nameWithOwner.trim(),
    description: data.description?.trim(),
    stargazerCount: data.stargazerCount,
    primaryLanguage: data.primaryLanguage,
    updatedAt: data.updatedAt,
  });
};
