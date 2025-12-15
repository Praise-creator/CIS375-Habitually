// src/auth/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "habitually-user";

export type StoredUser = {
  name: string;
  email: string;
  password: string;
};

export async function saveUser(user: StoredUser) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function loadUser(): Promise<StoredUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export async function updateUserName(newName: string) {
  const user = await loadUser();
  if (!user) return;
  const updated: StoredUser = { ...user, name: newName };
  await saveUser(updated);
}

export async function clearUser() {
  await AsyncStorage.removeItem(USER_KEY);
}
