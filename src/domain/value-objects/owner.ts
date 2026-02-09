import { err, ok, type Result } from "../../shared/result";

/**
 * Owner information value object.
 * Represents the profile owner's identity and location.
 */
export interface Owner {
  readonly name: string;
  readonly username: string;
  readonly title: string;
  readonly location: string;
  readonly timezone: string;
}

/**
 * Creates a validated Owner value object.
 * Ensures username follows GitHub's naming constraints.
 */
export const createOwner = (data: {
  name: string;
  username: string;
  title: string;
  location: string;
  timezone: string;
}): Result<Owner, Error> => {
  // Trim values first
  const trimmedUsername = data.username.trim();
  const trimmedName = data.name.trim();
  const trimmedTitle = data.title.trim();
  const trimmedLocation = data.location.trim();
  const trimmedTimezone = data.timezone.trim();

  // Validate username (GitHub constraints)
  if (!trimmedUsername) {
    return err(new Error("Username cannot be empty"));
  }

  if (trimmedUsername.length > 39) {
    return err(new Error("Username exceeds GitHub's 39 character limit"));
  }

  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(trimmedUsername)) {
    return err(new Error("Username contains invalid characters"));
  }

  // Validate other required fields
  if (!trimmedName) {
    return err(new Error("Name cannot be empty"));
  }

  if (!trimmedTitle) {
    return err(new Error("Title cannot be empty"));
  }

  if (!trimmedLocation) {
    return err(new Error("Location cannot be empty"));
  }

  if (!trimmedTimezone) {
    return err(new Error("Timezone cannot be empty"));
  }

  // Return validated value object
  return ok({
    name: trimmedName,
    username: trimmedUsername,
    title: trimmedTitle,
    location: trimmedLocation,
    timezone: trimmedTimezone,
  });
};
