// src/services/appStateStorage.ts

import { AppState } from "../App";

const STORAGE_KEY = "habitTrackerState";

// Load state from localStorage
export function loadAppState(): AppState | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  const parsed = JSON.parse(stored);

  return {
    ...parsed,
    registeredUsers: parsed.registeredUsers || [],
  };
}

// Save state to localStorage
export function saveAppState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
