import type { EasterEggType } from "../value-objects/easter-egg";

export const getEasterEgg = (date: Date): EasterEggType | null => {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0-6 (0 is Sunday, 5 is Friday)

  if (month === 5 && day === 4) return "may-the-4th";
  if (month === 10 && day === 31) return "halloween";
  if (month === 12 && day === 25) return "christmas";
  if (day === 13 && dayOfWeek === 5) return "friday-13th";

  return null;
};
