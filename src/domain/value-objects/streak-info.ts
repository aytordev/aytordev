export interface StreakInfo {
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly lastContributionDate: Date;
  readonly isActive: boolean;
}
