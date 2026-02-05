import type { TimeOfDay } from "../value-objects/time-of-day";

export interface ClockPort {
  getCurrentTime(timezone: string): Date;
  getTimeOfDay(timezone: string): TimeOfDay;
  formatTime(date: Date, timezone: string): string;
}
