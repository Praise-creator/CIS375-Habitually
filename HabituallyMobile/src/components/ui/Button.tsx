import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, type } from "../../theme/tokens";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export function Button({ label, variant = "primary", onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    height: 52,                 
    borderRadius: 18,           
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing(2),
  },
  primary: {
    backgroundColor: "#111111",
  },
  secondary: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...type.body,
    fontWeight: "500",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: "#111111",
  },
});
