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
