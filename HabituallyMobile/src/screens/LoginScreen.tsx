import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert, Pressable} from "react-native";
import { Screen } from "../components/layout/Screen";
import { TextField } from "../components/ui/TextField";
import { Button } from "../components/ui/Button";
import { spacing, type, colors } from "../theme/tokens";
import { loadUser, StoredUser } from "../auth/storage";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: any;
  onLoggedIn: (user: StoredUser) => void;
};

export function LoginScreen({ navigation, onLoggedIn }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const USERS_KEY = "habitually-users";
  type StoredUser = { name: string; email: string; password: string };

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }

    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const list: StoredUser[] = raw ? JSON.parse(raw) : [];

      const found = list.find(
        (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
      );

      if (!found) {
        Alert.alert("Incorrect credentials", "Email or password is not correct.");
        return;
      }

      // Hand the full user back to App.tsx, which finishes persistence + nav
      onLoggedIn(found);
    } catch (e) {
      console.warn("Login check failed", e);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };


  const handleSubmit = async () => {
    const storedUser = await loadUser();

    if (!storedUser) {
      Alert.alert("No account", "Please sign up before logging in.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail !== storedUser.email || password !== storedUser.password) {
      Alert.alert("Incorrect credentials", "Email or password is not correct.");
      return;
    }

    // credentials ok – log them in
    onLoggedIn(storedUser);
  };

  return (
    <Screen>
        <View style={styles.header}>
          <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.primary} />
          </Pressable>
          {/** 
          <Text style={{ ...type.h2, fontWeight: "600" }}>Log In</Text>
          <View style={{ width: 24 }} />
          */}
        </View>

      <View style={styles.container}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Log in to continue</Text>

        <TextField
          label="Email"
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("PasswordRecovery")}
          style={styles.forgotRow}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={{ width: "100%", marginTop: spacing(2) }}>
          <Button
            label="Log In"
            onPress={handleLogin}
            disabled={!email.trim() || !password}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={styles.footerLink}
        >
          <Text style={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.footerStrong}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: spacing(2),
    marginTop: spacing(3)
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing(2),
    marginTop: spacing(12),
  },
  heading: {
    ...type.h2,
    marginBottom: spacing(0.5),
  },
  subheading: {
    ...type.small,
    color: colors.mutedText,
    marginBottom: spacing(2),
  },
  forgotRow: {
    alignItems: "flex-end",
    marginTop: spacing(1),
  },
  forgotText: {
    ...type.small,
    color: colors.primary,
  },
  footerLink: {
    marginTop: spacing(3),
    alignItems: "center",
  },
  footerText: {
    ...type.small,
    color: colors.mutedText,
  },
  footerStrong: {
    color: colors.primary,
    fontWeight: "600",
  },
});
