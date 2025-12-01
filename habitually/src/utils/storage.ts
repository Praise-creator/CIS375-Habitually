import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/types';

const HABITS_KEY = '@habitually_habits';

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(HABITS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving habits:', e);
  }
};

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading habits:', e);
    return [];
  }
};