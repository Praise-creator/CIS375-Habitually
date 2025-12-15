import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { spacing } from "../../theme/tokens";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        style,
      ]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(2),
    borderRadius: 20, // slightly rounded rectangle
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: "#111111",
  },
  chipLabel: {
    fontSize: 16,
    color: "#111111",     // black text when not selected
  },
  chipLabelSelected: {
    color: "#ffffff",     // white text when selected
  },
});
