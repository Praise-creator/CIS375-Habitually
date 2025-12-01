export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  membershipTier: 'free' | 'premium';
  createdAt: Date;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  time?: string; // Format: "HH:MM"
  reminderEnabled: boolean;
  createdAt: Date;
  streak: number;
  completionDates: string[]; // ISO date strings
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // ISO date string
  completed: boolean;
}