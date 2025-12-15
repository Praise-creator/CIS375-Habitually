// src/types.ts

export type TimeRange = "morning" | "afternoon" | "evening" | "anytime";

export type RecurrenceType = "daily" | "weekly" | "monthly" | "interval";

export interface Recurrence {
  type: RecurrenceType;
  weekDays?: number[];   // 0-6 (Sun-Sat) for weekly
  monthDay?: number;     // 1-31 for monthly
  intervalDays?: number; // interval in days
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  timeRange: TimeRange;
  reminder: boolean;
  reminderTime?: string;
  recurrence: Recurrence;
  completedDates: string[]; // e.g. new Date().toDateString()
  createdAt: string;
}

export interface AppState {
  isLoggedIn: boolean;
  userName: string | null;
  habits: Habit[];
}
