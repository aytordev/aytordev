import { type Result, ok, err } from "../../shared/result";

export interface StreakInfo {
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly lastContributionDate: Date;
  readonly isActive: boolean;
}

/**
 * Creates a validated StreakInfo value object.
 */
export const createStreakInfo = (data: {
  currentStreak: number;
  longestStreak: number;
  lastContributionDate: Date;
  isActive: boolean;
}): Result<StreakInfo, Error> => {
  // Validate currentStreak (non-negative)
  if (data.currentStreak < 0) {
    return err(new Error("Current streak cannot be negative"));
  }

  // Validate longestStreak (non-negative and >= currentStreak)
  if (data.longestStreak < 0) {
    return err(new Error("Longest streak cannot be negative"));
  }

  if (data.longestStreak < data.currentStreak) {
    return err(new Error("Longest streak must be greater than or equal to current streak"));
  }

  // Validate date (must be valid)
  if (Number.isNaN(data.lastContributionDate.getTime())) {
    return err(new Error("Last contribution date is invalid"));
  }

  // Return validated value object
  return ok({
    currentStreak: data.currentStreak,
    longestStreak: data.longestStreak,
    lastContributionDate: data.lastContributionDate,
    isActive: data.isActive,
  });
};
