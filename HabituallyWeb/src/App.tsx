import { useState, useEffect } from "react";
import { PhoneFrame } from "./components/PhoneFrame";
import { WelcomePage } from "./components/WelcomePage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { PasswordRecoveryPage } from "./components/PasswordRecoveryPage";
import { HomePage } from "./components/HomePage";
import { HabitCreationPage } from "./components/HabitCreationPage";
import { HabitDetailPage } from "./components/HabitDetailPage";
import { CalendarPage } from "./components/CalendarPage";
import { SettingsPage } from "./components/SettingsPage";

import { loadAppState, saveAppState } from "./services/appStateStorage";
import {
   loginAction, 
   signupAction, 
   logoutAction, 
   addHabitAction, 
   updateHabitAction, 
   deleteHabitAction, 
   toggleHabitTodayAction
} from "./services/appStateActions";

export type Screen =
  | "welcome"
  | "login"
  | "signup"
  | "password-recovery"
  | "home"
  | "habit-creation"
  | "habit-detail"
  | "calendar"
  | "settings";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  timeRange: "morning" | "afternoon" | "evening" | "anytime";
  reminder: boolean;
  reminderTime?: string;
  recurrence: {
    type: "daily" | "weekly" | "monthly" | "interval";
    weekDays?: number[]; // 0-6 for Sunday-Saturday
    monthDay?: number; // 1-31
    intervalDays?: number;
  };
  completedDates: string[];
  createdAt: string;
}

export interface AppState {
  isLoggedIn: boolean;
  user: {
    name: string;
    avatar: string;
  } | null;
  habits: Habit[];
  theme: "light" | "dark";
  registeredUsers: {
    email: string;
    password: string;
    name: string;
  }[];
}

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const [appState, setAppState] = useState<AppState>({
    isLoggedIn: false,
    user: null,
    habits: [],
    theme: "light",
    registeredUsers: [],
  });


  // Load state from localStorage via service on first mount
  useEffect(() => {
    const stored = loadAppState();
    if (stored) {
      setAppState(stored);
      if (stored.isLoggedIn) {
        setScreen("home");
      }
    }
  }, []);

  // Save appState to localStorage via service whenever it changes
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);


  const login = (name: string) => {
    setAppState((prev) => loginAction(prev, name));
    setScreen("home");
  };

  const signup = (email: string, password: string, name: string) => {
    setAppState((prev) => signupAction(prev, email, password, name));
    setScreen("home");
  };

  const logout = () => {
    setAppState((prev) => logoutAction(prev));
    setScreen("welcome");
  };

  const addHabit = (
    habit: Omit<Habit, "id" | "createdAt" | "completedDates">
  ) => {
    setAppState((prev) => addHabitAction(prev, habit));
    setScreen("home");
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setAppState((prev) => updateHabitAction(prev, id, updates));
  };

  const deleteHabit = (id: string) => {
    setAppState((prev) => deleteHabitAction(prev, id));
    setScreen("home");
  };

  const toggleHabitToday = (id: string) => {
    setAppState((prev) => toggleHabitTodayAction(prev, id));
  };
 
  const updateProfile = (name: string, avatar: string) => {
    setAppState({
      ...appState,
      user: { name, avatar },
    });
  };

  const toggleTheme = () => {
    setAppState({
      ...appState,
      theme: appState.theme === "light" ? "dark" : "light",
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], {
      type: "application/json",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "habits-backup.json";
    link.click();
  };

  const importData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      setAppState(imported);
    } catch (e) {
      alert("Invalid backup file");
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "welcome":
        return (
          <WelcomePage
            onNavigate={setScreen}
            theme={appState.theme}
          />
        );
      case "login":
        return (
          <LoginPage
            onNavigate={setScreen}
            onLogin={login}
            theme={appState.theme}
            registeredUsers={appState.registeredUsers}
          />
        );
      case "signup":
        return (
          <SignupPage
            onNavigate={setScreen}
            onSignup={signup}
            theme={appState.theme}
          />
        );
      case "password-recovery":
        return (
          <PasswordRecoveryPage
            onNavigate={setScreen}
            theme={appState.theme}
          />
        );
      case "home":
        return (
          <HomePage
            habits={appState.habits}
            onNavigate={setScreen}
            onSelectHabit={(id) => {
              setSelectedHabitId(id);
              setScreen("habit-detail");
            }}
            onToggleHabit={toggleHabitToday}
            theme={appState.theme}
          />
        );
      case "habit-creation":
        return (
          <HabitCreationPage
            onNavigate={setScreen}
            onSave={addHabit}
            theme={appState.theme}
          />
        );
      case "habit-detail":
        const selectedHabit = appState.habits.find(
          (h) => h.id === selectedHabitId,
        );
        return selectedHabit ? (
          <HabitDetailPage
            habit={selectedHabit}
            onNavigate={setScreen}
            onUpdate={(updates) =>
              updateHabit(selectedHabit.id, updates)
            }
            onDelete={() => deleteHabit(selectedHabit.id)}
            onToggleToday={() =>
              toggleHabitToday(selectedHabit.id)
            }
            theme={appState.theme}
          />
        ) : null;
      case "calendar":
        return (
          <CalendarPage
            habits={appState.habits}
            onNavigate={setScreen}
            onSelectHabit={(id) => {
              setSelectedHabitId(id);
              setScreen("habit-detail");
            }}
            theme={appState.theme}
          />
        );
      case "settings":
        return (
          <SettingsPage
            user={appState.user!}
            theme={appState.theme}
            onNavigate={setScreen}
            onLogout={logout}
            onUpdateProfile={updateProfile}
            onToggleTheme={toggleTheme}
            onExport={exportData}
            onImport={importData}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-8">
      <PhoneFrame theme={appState.theme}>
        {renderScreen()}
      </PhoneFrame>
    </div>
  );
} 

export default App;