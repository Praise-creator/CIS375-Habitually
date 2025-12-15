import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Screen } from "../components/layout/Screen";
import { TextField } from "../components/ui/TextField";
import { Button } from "../components/ui/Button";
import { spacing, type, colors } from "../theme/tokens";
import { Feather } from "@expo/vector-icons";

type Props = {
  navigation: any;
  route: any;
  onBack: () => void;
};

export function PasswordRecoveryScreen({ navigation, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email.trim()) return;
    setSent(true); // fake success
  };

  return (
    //<Screen title="Reset password" onBack={onBack} scroll={false}>
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
        {/*
        <Text style={{ ...type.h2, fontWeight: "600" }}>Reset password</Text>
        <View style={{ width: 24 }} />
        */}
      </View>

      <View style={styles.container}>
        <Text style={styles.heading}>Reset password</Text>
        <Text style={styles.subheading}>
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </Text>

        <TextField
          label="Email"
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={{ width: "100%", marginTop: spacing(2) }}>
          <Button
            label={sent ? "Email sent" : "Send Reset Link"}
            onPress={handleSend}
            disabled={!email.trim()}
          />
        </View>

        {sent && (
          <Text style={styles.info}>
            If an account exists for that email, you&apos;ll receive a reset
            link.
          </Text>
        )}

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",        
    paddingHorizontal: spacing(2),
    justifyContent: "flex-start",     
    paddingTop: spacing(8),    
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
  info: {
    ...type.small,
    color: colors.mutedText,
    marginTop: spacing(1),
  },
  backLink: {
    marginTop: spacing(3),
    alignItems: "center",
  },
  backText: {
    ...type.small,
    color: colors.primary,
  },
});
