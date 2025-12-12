import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Screen } from "../components/layout/Screen";
import { TextField } from "../components/ui/TextField";
import { Button } from "../components/ui/Button";
import { spacing, type, colors } from "../theme/tokens";
import { saveUser, StoredUser } from "../auth/storage";
import { Feather } from "@expo/vector-icons";

type Props = {
  navigation: any;
  onSignedUp: (user: StoredUser) => void;
};

export function SignupScreen({ navigation, onSignedUp }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const passwordsMismatch = password.length > 0 && confirm.length > 0 && password !== confirm;

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password || passwordsMismatch) {
      return;
    }

    const user: StoredUser = {
      name: trimmedName,
      email: trimmedEmail,
      password,
    };

    // save to local storage
    await saveUser(user);

    // go back to app with this user
    onSignedUp(user);
  };

  return (
    //<Screen title="Sign up" onBack={() => navigation.goBack()} scroll={false}>
    <Screen>
      <View style={{ 
              height: 48, 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "space-between", 
              paddingHorizontal: spacing(2),
              marginTop: spacing(3),}}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </Pressable>
        {/**
        <Text style={{ ...type.h2, fontWeight: "600" }}>Sign Up</Text>
        <View style={{ width: 24 }} />
        */}
      </View>

      <View style={styles.container}>
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subheading}>Sign up to get started</Text>

        <TextField
          label="Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
        />
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
        <TextField
          label="Confirm Password"
          placeholder="••••••••"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          error={passwordsMismatch ? "Passwords do not match" : undefined}
        />

        <View style={{ width: "100%", marginTop: spacing(2) }}>
          <Button
            label="Sign Up"
            onPress={handleSubmit}
            disabled={
              !name.trim() ||
              !email.trim() ||
              !password ||
              passwordsMismatch
            }
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.footerLink}
        >
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.footerStrong}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing(2),
    marginTop: spacing(3),
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
