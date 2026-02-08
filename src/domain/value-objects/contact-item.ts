import { type Result, ok, err } from "../../shared/result";

export interface ContactItem {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

/**
 * Creates a validated ContactItem value object.
 */
export const createContactItem = (data: {
  label: string;
  value: string;
  icon: string;
}): Result<ContactItem, Error> => {
  // Validate fields
  if (!data.label || data.label.trim() === "") {
    return err(new Error("Contact label cannot be empty"));
  }

  if (!data.value || data.value.trim() === "") {
    return err(new Error("Contact value cannot be empty"));
  }

  if (!data.icon || data.icon.trim() === "") {
    return err(new Error("Contact icon cannot be empty"));
  }

  // Return validated value object
  return ok({
    label: data.label.trim(),
    value: data.value.trim(),
    icon: data.icon.trim(),
  });
};
