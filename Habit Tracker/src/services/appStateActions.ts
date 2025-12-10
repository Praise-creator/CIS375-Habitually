// src/services/appStateActions.ts

import { AppState, Habit } from "../App";

// LOGIN
export function loginAction(state: AppState, name: string): AppState {
  return {
    ...state,
    isLoggedIn: true,
    user: { name, avatar: "👤" },
  };
}

// SIGNUP
export function signupAction(
  state: AppState,
  email: string,
  password: string,
  name: string
): AppState {
  return {
    ...state,
    isLoggedIn: true,
    user: { name, avatar: "👤" },
    registeredUsers: [...state.registeredUsers, { email, password, name }],
  };
}

// LOGOUT
export function logoutAction(state: AppState): AppState {
  return { ...state, isLoggedIn: false, user: null };
}

// ADD HABIT
export function addHabitAction(
  state: AppState,
  habit: Omit<Habit, "id" | "createdAt" | "completedDates">
): AppState {
  const newHabit: Habit = {
    ...habit,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    completedDates: [],
  };

  return {
    ...state,
    habits: [...state.habits, newHabit],
  };
}

// UPDATE HABIT
export function updateHabitAction(
  state: AppState,
  id: string,
  updates: Partial<Habit>
): AppState {
  return {
    ...state,
    habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
  };
}

// DELETE HABIT
export function deleteHabitAction(state: AppState, id: string): AppState {
  return {
    ...state,
    habits: state.habits.filter((h) => h.id !== id),
  };
}

// TOGGLE HABIT COMPLETION
export function toggleHabitTodayAction(
  state: AppState,
  id: string
): AppState {
  const today = new Date().toDateString();

  return {
    ...state,
    habits: state.habits.map((habit) => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(today);
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today],
        };
      }
      return habit;
    }),
  };
}
