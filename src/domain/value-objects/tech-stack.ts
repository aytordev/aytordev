import { err, ok, type Result } from "../../shared/result";

export interface TechStackCategory {
  readonly name: string;
  readonly items: readonly string[];
}

export interface TechStack {
  readonly categories: readonly TechStackCategory[];
}

/**
 * Creates a validated TechStackCategory value object.
 */
export const createTechStackCategory = (data: {
  name: string;
  items: readonly string[];
}): Result<TechStackCategory, Error> => {
  // Validate name
  if (!data.name || data.name.trim() === "") {
    return err(new Error("Category name cannot be empty"));
  }

  // Validate items (all non-empty)
  if (data.items.some((item) => !item || item.trim() === "")) {
    return err(new Error("Category items cannot contain empty strings"));
  }

  // Return validated value object
  return ok({
    name: data.name.trim(),
    items: data.items.map((item) => item.trim()),
  });
};

/**
 * Creates a validated TechStack value object.
 */
export const createTechStack = (data: {
  categories: readonly TechStackCategory[];
}): Result<TechStack, Error> => {
  // Return validated value object
  return ok({
    categories: data.categories,
  });
};
