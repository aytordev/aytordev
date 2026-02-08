import type { StreakInfo } from "../value-objects/streak-info";

interface ContributionDay {
  readonly contributionCount: number;
  readonly date: string;
}

interface StreakAccumulator {
  readonly tempStreak: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly isActive: boolean;
}

export const calculateStreak = (days: readonly ContributionDay[]): StreakInfo => {
  const sortedDays = [...days].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Use reduce instead of for loop with mutations
  const { currentStreak, longestStreak, tempStreak, isActive } =
    sortedDays.reduce<StreakAccumulator>(
      (acc, day, i) => {
        if (day.contributionCount === 0) {
          // Reset tempStreak and update longestStreak if needed
          const newLongest = Math.max(acc.longestStreak, acc.tempStreak);
          const newCurrent =
            acc.currentStreak === 0 && acc.tempStreak > 0 ? acc.tempStreak : acc.currentStreak;
          return {
            ...acc,
            tempStreak: 0,
            currentStreak: newCurrent,
            longestStreak: newLongest,
          };
        }

        const newTempStreak = acc.tempStreak + 1;
        const newIsActive =
          acc.isActive || (i === 0 && (day.date === today || day.date === yesterday));

        return {
          tempStreak: newTempStreak,
          currentStreak: acc.currentStreak === 0 ? newTempStreak : acc.currentStreak,
          longestStreak: Math.max(acc.longestStreak, newTempStreak),
          isActive: newIsActive,
        };
      },
      {
        tempStreak: 0,
        currentStreak: 0,
        longestStreak: 0,
        isActive: false,
      },
    );

  // Handle final streak
  const finalLongest = Math.max(longestStreak, tempStreak);
  const finalCurrent = currentStreak === 0 && tempStreak > 0 ? tempStreak : currentStreak;

  return {
    currentStreak: isActive ? finalCurrent : 0,
    longestStreak: finalLongest,
    lastContributionDate: new Date(sortedDays[0]?.date ?? Date.now()),
    isActive,
  };
};
