import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from "react-native";
import { Screen } from "../components/layout/Screen";
//import { Button } from "../components/ui/Button";
import { colors, spacing, type } from "../theme/tokens";

type Props = {
  onGoLogin: (e: GestureResponderEvent) => void;
  onGoSignup: (e: GestureResponderEvent) => void;
};

export function WelcomeScreen({ onGoLogin, onGoSignup }: Props) {
  return (
    <Screen scroll={false}>
      <View style={styles.root}>
        {/* CENTER BLOCK: logo + title + subtitle */}
        <View style={styles.centerBlock}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>H</Text>
          </View>

          <Text style={styles.appName}>Habitually</Text>
          <Text style={styles.subtitle}>
            Build better habits, one day at a time
          </Text>
        </View>

        {/* BOTTOM BLOCK: buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton} onPress={onGoLogin}>
            <Text style={styles.primaryText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onGoSignup}>
            <Text style={styles.secondaryText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // whole screen layout: centerBlock + buttons
  root: {
    flex: 1,
    justifyContent: "space-between", // centerBlock + buttonGroup separated
    alignItems: "center",
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
    paddingBottom: spacing(3),
  },

  // center logo + text
  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, 
  },

  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing(2),
  },
  logoLetter: {
    fontSize: 48,
    fontWeight: "700",
    color: "white",
  },
  appName: {
    ...type.h2,
    marginBottom: spacing(0.5),
  },
  subtitle: {
    ...type.small,
    color: colors.mutedText,
    textAlign: "center",
    marginHorizontal: spacing(1),
  },

  // bottom buttons
  buttonGroup: {
    width: "100%",
    gap: spacing(1.5),
    paddingHorizontal: spacing(1),
    marginBottom: spacing(1), // tweak this to move buttons slightly up/down
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 18, // slightly rounded, not too pill-shaped
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
  },
});