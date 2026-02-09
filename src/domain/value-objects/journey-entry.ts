import { type Result, err, ok } from "../../shared/result";

export interface JourneyEntry {
  readonly year: number;
  readonly icon: string;
  readonly title: string;
  readonly tags?: ReadonlyArray<string>;
}

export const createJourneyEntry = (data: {
  year: number;
  icon: string;
  title: string;
  tags?: ReadonlyArray<string>;
}): Result<JourneyEntry, Error> => {
  if (data.year < 1900 || data.year > 2100) {
    return err(new Error("Year must be between 1900 and 2100"));
  }

  if (!data.icon || data.icon.trim() === "") {
    return err(new Error("Journey icon cannot be empty"));
  }

  if (!data.title || data.title.trim() === "") {
    return err(new Error("Journey title cannot be empty"));
  }

  if (data.tags && data.tags.length > 5) {
    return err(new Error("Journey entry cannot have more than 5 tags"));
  }

  return ok({
    year: data.year,
    icon: data.icon.trim(),
    title: data.title.trim(),
    tags: data.tags?.map((t) => t.trim()),
  });
};
