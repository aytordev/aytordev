import type { ClockPort } from "../../domain/ports/clock.port";
import type { TimeOfDay } from "../../domain/value-objects/time-of-day";

export const createSystemClockAdapter = (): ClockPort => ({
  getCurrentTime: (timezone: string) => new Date(),

  getTimeOfDay: (timezone: string) => {
    const hours = new Date().getHours();
    if (hours < 12) return "morning";
    if (hours < 17) return "afternoon";
    if (hours < 21) return "evening";
    return "night";
  },

  formatTime: (date: Date, timezone: string) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
});
