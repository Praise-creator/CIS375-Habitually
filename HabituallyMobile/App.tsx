import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignupScreen } from "./src/screens/SignupScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { HabitCreationScreen } from "./src/screens/HabitCreationScreen";
import { HabitDetailScreen } from "./src/screens/HabitDetailScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { PasswordRecoveryScreen } from "./src/screens/PasswordRecoveryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { Habit } from "./src/types";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  PasswordRecovery: undefined;
  Home: undefined;
  HabitCreation: { id?: string } | undefined;
  HabitDetail: { id: string };
  Calendar: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const [users, setUsers] = React.useState<StoredUser[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList | null>(null);

  const [habits, setHabits] = React.useState<Habit[]>([]);

  const USERS_KEY = "habitually-users";
  const CURRENT_USER_KEY = "habitually-current-user";
  const habitsKey = (email: string) => `habitually-habits:${email}`;

  type StoredUser = { name: string; email: string; password: string };

  // 1) Boot – load users & current user ONCE, set initialRoute, and load habits for that user
  React.useEffect(() => {
    (async () => {
      try {
        const [rawUsers, rawCurrent] = await Promise.all([
          AsyncStorage.getItem(USERS_KEY),
          AsyncStorage.getItem(CURRENT_USER_KEY),
        ]);

        const parsedUsers = rawUsers ? JSON.parse(rawUsers) : [];
        setUsers(Array.isArray(parsedUsers) ? parsedUsers : []);

        const current = rawCurrent ? JSON.parse(rawCurrent) : null;
        setUser(current);

        if (current?.email) {
          const rawHabits = await AsyncStorage.getItem(habitsKey(current.email));
          const parsedHabits = rawHabits ? JSON.parse(rawHabits) : [];
          setHabits(Array.isArray(parsedHabits) ? parsedHabits : []);
          setInitialRoute("Home");                
        } else {
          setInitialRoute("Welcome");            
        }
      } catch (e) {
        console.warn("Init load failed", e);
        setUsers([]);
        setUser(null);
        setHabits([]);
        setInitialRoute("Welcome");
      }
    })();
  }, []);

  // 2) When the current user changes (login/signup), (re)load that user's habits
  useEffect(() => {
    const loadForUser = async () => {
      if (!user?.email) {
        setHabits([]);
        return;
      }
      try {
        const raw = await AsyncStorage.getItem(habitsKey(user.email));
        const parsed = raw ? JSON.parse(raw) : [];
        setHabits(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.warn("Failed to load habits for user", e);
        setHabits([]);
      }
    };
    loadForUser();
  }, [user?.email]);

  // 3) Save habits whenever they change (for the current user)
  useEffect(() => {
    const save = async () => {
      if (!user?.email) return;
      try {
        await AsyncStorage.setItem(habitsKey(user.email), JSON.stringify(habits));
      } catch (e) {
        console.warn("Failed to save habits", e);
      }
    };
    save();
  }, [habits, user?.email]);

  // AUTH handlers
  const handleSignedUp = React.useCallback (
    async (newUser: StoredUser) => {
    // ensure users list includes this account
      try {
        const raw = await AsyncStorage.getItem(USERS_KEY);
        const list: StoredUser[] = raw ? JSON.parse(raw) : [];
        const exists = list.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
        const next = exists ? list : [...list, newUser];
        if (!exists) await AsyncStorage.setItem(USERS_KEY, JSON.stringify(next));
        // set current user
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        setUsers(next);
        setUser(newUser);
        // ensure empty habit bucket exists
        const hk = habitsKey(newUser.email);
        const has = await AsyncStorage.getItem(hk);
        if (!has) await AsyncStorage.setItem(hk, JSON.stringify([]));
        setHabits([]);
      } catch (e) {
        console.warn("Signup persistence failed", e);
      }
    },
    [setUsers, setUser, setHabits]
  );

  const handleLoggedIn = React.useCallback(
    async (loggedInUser: StoredUser) => {
      try {
        // keep users list in memory fresh
        const raw = await AsyncStorage.getItem(USERS_KEY);
        const list: StoredUser[] = raw ? JSON.parse(raw) : [];
        setUsers(Array.isArray(list) ? list : []);
        // set current user
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        // load their habits
        const hk = habitsKey(loggedInUser.email);
        const rawHabits = await AsyncStorage.getItem(hk);
        const parsedHabits = rawHabits ? JSON.parse(rawHabits) : [];
        setHabits(Array.isArray(parsedHabits) ? parsedHabits : []);
      } catch (e) {
        console.warn("Login persistence failed", e);
      }
    },
    [setUsers, setUser, setHabits]
);

  const handleUserChange = (updated: StoredUser | null) => {
    setUser(updated);
  };

  /*
  const handleLogout = async () => {
      await clearUser();
      setUser(null);
      setHabits([]);            
      setInitialRoute("Welcome");
  };*/

  async function handleLogout() {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setHabits([]);         
  }

  // HABIT handlers
  const addHabit = (habitInput: any) => {
    const newHabit = {
      ...habitInput,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const toggleHabitToday = (id: string) => {
    const today = new Date().toDateString();

    setHabits((prev: Habit[]) =>
      prev.map((h: Habit): Habit => {
        if (h.id !== id) return h;

        const alreadyDone = h.completedDates.includes(today);

        return {
          ...h,
          completedDates: alreadyDone
            ? h.completedDates.filter((d: string) => d !== today)
            : [...h.completedDates, today],
        };
      })
    );
  };

  const updateHabit = (updated: any) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === updated.id ? { ...h, ...updated } : h))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Wait until we know if there is a stored user to choose initial route
  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* WELCOME */}
        <Stack.Screen name="Welcome">
          {(props) => (
            <WelcomeScreen
              onGoLogin={() => props.navigation.navigate("Login")}
              onGoSignup={() => props.navigation.navigate("Signup")}
            />
          )}
        </Stack.Screen>

        {/* LOGIN */}
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onLoggedIn={async (u) => {
                //handleLoggedIn(u);
                await handleLoggedIn(u); // persist + load habits
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" as never }],
                });
              }}
            />
          )}
        </Stack.Screen>

        {/* SIGNUP */}
        <Stack.Screen name="Signup">
          {(props) => (
            <SignupScreen
              {...props}
              onSignedUp={async (u) => {
                // handleSignedUp(u);
                await handleSignedUp(u); // persist + prep bucket
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" as never }],
                });
              }}
            />
          )}
        </Stack.Screen>

        {/* PASSWORD RECOVERY */}
        <Stack.Screen name="PasswordRecovery">
          {(props) => (
            <PasswordRecoveryScreen
              {...props}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* HOME */}
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              habits={habits}
              onAddHabitPress={() => props.navigation.navigate("HabitCreation")}
              onToggleToday={toggleHabitToday}
            />
          )}
        </Stack.Screen>

        {/* HABIT CREATION */}
        <Stack.Screen name="HabitCreation">
          {(props) => (
            <HabitCreationScreen
              {...props}
              onSave={(habitInput) => {
                addHabit(habitInput);
                props.navigation.goBack();
              }}
              onCancel={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* HABIT DETAIL */}
        <Stack.Screen name="HabitDetail">
          {(props) => (
            <HabitDetailScreen
              {...({
                ...props,
                habits,
                onUpdateHabit: (updated: any) => {
                  updateHabit(updated);
                },
                onDeleteHabit: (id: string) => {
                  deleteHabit(id);
                  props.navigation.goBack();
                },
              } as any)}
            />
          )}
        </Stack.Screen>

        {/* CALENDAR */}
        <Stack.Screen name="Calendar">
          {(props) => <CalendarScreen {...props} habits={habits} />}
        </Stack.Screen>

        {/* SETTINGS */}
        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen
              {...props}
              user={user}
              onUserChange={(updated) => handleUserChange(updated)}
              onLogout={async () => {
                //handleLogout();
                await handleLogout();
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: "Welcome" as never }],
                });
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
