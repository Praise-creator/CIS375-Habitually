import React, { ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors, spacing, type } from "../../theme/tokens";

type Props = {
  title?: string;
  children: React.ReactNode;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
  scroll?: boolean;
  variant?: "light" | "dark";  
};

export function Screen({
  title,
  children,
  onBack,
  rightLabel,
  onRightPress,
  scroll = true,
  variant = "light",     
}: Props) {
  const isDark = variant === "dark";
  const Wrapper = scroll ? ScrollView : View;

  return (
      <SafeAreaView
        style={[
          styles.safe,
          isDark && { backgroundColor: "#000" },
        ]}
     >
      <View
        style={[
          styles.container,
          isDark && { backgroundColor: "#000" },
        ]}
      >
        <Wrapper
          style={{ flex: 1 }}
          {...(scroll
            ? {
                contentContainerStyle: { paddingBottom: spacing(3) },
                showsVerticalScrollIndicator: false,
              }
            : {})}
        >
          {children}
        </Wrapper>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing(2),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing(1),
    marginBottom: spacing(2),
  },
  backText: {
    ...type.h2,
    color: colors.primary,
  },
  title: {
    ...type.h2,
    color: colors.primary,
  },
  rightText: {
    ...type.small,
    color: colors.primary,
  },
  scroll: {
    flex: 1,
  },
});
