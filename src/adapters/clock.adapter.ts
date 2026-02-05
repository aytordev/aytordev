import type { ClockPort } from "../domain/ports/clock.port";
import type { TimeOfDay } from "../domain/value-objects/time-of-day";

export class SystemClockAdapter implements ClockPort {
  getCurrentTime(timezone: string): Date {
    // In a real app, we'd use timezone to adjust.
    // For now, returning system time or simple offset.
    return new Date();
  }

  getTimeOfDay(timezone: string): TimeOfDay {
    const hours = this.getCurrentTime(timezone).getHours();
    if (hours < 12) return "morning";
    if (hours < 17) return "afternoon";
    if (hours < 21) return "evening";
    return "night";
  }

  formatTime(date: Date, timezone: string): string {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
