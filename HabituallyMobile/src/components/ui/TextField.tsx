import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, TextStyle } from "react-native";
import { colors, spacing, radii, type } from "../../theme/tokens";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;  
  inputStyle?: TextStyle;  
};

export function TextField({ label, error, style, containerStyle, inputStyle,  ...rest}: Props) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...rest}
        style={[styles.input, style, inputStyle]}  // apply inputStyle last
        placeholderTextColor={colors.mutedText}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing(1.5),
  },
  label: {
    ...type.small,
    marginBottom: spacing(0.5),
    color: colors.mutedText,
  },
  wrap: { marginBottom: spacing(1) },
  input: {
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: colors.surface, // default
    color: "#111111",
  },
  /*
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1),
    ...type.body,
    color: colors.primary,
    backgroundColor: colors.surface,
  },
  */
 /*
  input: {
    width: "100%",
    height: 52,                 
    borderRadius: 18,           
    paddingHorizontal: spacing(1.5),
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#f3f3f3",
  },*/
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    ...type.small,
    color: colors.danger,
    marginTop: spacing(0.5),
  },
});
