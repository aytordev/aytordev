import { type Result, ok, err } from "../../shared/result";

export interface CareerMilestone {
  readonly year: number;
  readonly title: string;
  readonly company?: string;
}

/**
 * Creates a validated CareerMilestone value object.
 */
export const createCareerMilestone = (data: {
  year: number;
  title: string;
  company?: string;
}): Result<CareerMilestone, Error> => {
  // Validate year (reasonable range)
  const currentYear = new Date().getFullYear();
  if (data.year < 1900 || data.year > currentYear + 10) {
    return err(new Error("Year must be between 1900 and current year + 10"));
  }

  // Validate title
  if (!data.title || data.title.trim() === "") {
    return err(new Error("Title cannot be empty"));
  }

  // Validate company (optional, but if present must not be empty)
  if (data.company !== undefined && data.company.trim() === "") {
    return err(new Error("Company cannot be an empty string"));
  }

  // Return validated value object
  return ok({
    year: data.year,
    title: data.title.trim(),
    company: data.company?.trim(),
  });
};
