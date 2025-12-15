// src/screens/SettingsScreen.tsx
import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable} from "react-native";
import { Screen } from "../components/layout/Screen";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { spacing, type, colors } from "../theme/tokens";
import { Feather } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

type StoredUser = { name: string; email: string; password: string; avatar?: string };

type Props = {
  navigation: any;
  user: StoredUser | null;
  onUserChange?: (updated: StoredUser | null) => void;
  onLogout: () => void | Promise<void>;
};

const USERS_KEY = "habitually-users";
const CURRENT_USER_KEY = "habitually-current-user";
const habitsKey = (email: string) => `habitually-habits:${email}`;

const AVATARS = ["👤", "👨", "👩", "👦", "👧", "🐱", "🐶", "🐼", "🦊"];

export function SettingsScreen({ navigation, user, onUserChange, onLogout,} : Props) 
{
  const [name, setName] = useState(user?.name ?? "");
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>(user?.avatar ?? AVATARS[0]);

  const email = user?.email ?? "";

  useEffect(() => {
    setName(user?.name ?? "");
    setAvatar(user?.avatar ?? AVATARS[0]);
  }, [user?.name, user?.avatar]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  const saveProfile = async () => {
    if (!user) return;
    const updated: StoredUser = {
      ...user,
      name: name.trim(),
      avatar,
    };

  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    const list: StoredUser[] = raw ? JSON.parse(raw) : [];
    const next = list.map((u) =>
      u.email.toLowerCase() === user.email.toLowerCase() ? updated : u
    );
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(next));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

    onUserChange?.(updated);

    setEditing(false);
    } catch (e) {
      console.warn("Failed to save profile", e);
    }
  };

   // ---------------- Backup ----------------
  const exportBackup = async () => {
    try {
      const rawUsers = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];
      const habitsByEmail: Record<string, any[]> = {};
      for (const u of users) {
        const hk = habitsKey(u.email);
        const rawH = await AsyncStorage.getItem(hk);
        habitsByEmail[u.email] = rawH ? JSON.parse(rawH) : [];
      }

      const payload = { version: 1, exportedAt: new Date().toISOString(), users, habitsByEmail };
      const json = JSON.stringify(payload, null, 2);

      // Some SDK typings don’t expose these constants; use `any` to read them safely.
      const FS: any = FileSystem as any;
      const dir: string | null =
        FS.documentDirectory ?? FS.cacheDirectory ?? null;

      if (!dir) {
        Alert.alert("Export failed", "No writable directory available.");
        return;
      }

      const path = `${dir}habitually-backup-${Date.now()}.json`;

      await FileSystem.writeAsStringAsync(path, json);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, {
          mimeType: "application/json",
          dialogTitle: "Habitually Backup",
        });
      } else {
        Alert.alert("Backup saved", "File written to app directory.");
      }
    } catch (e) {
      console.warn("Export failed", e);
      Alert.alert("Export failed", "Could not create backup.");
    }

  };

  const importBackup = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "application/json",
      });
      if (res.canceled || !res.assets?.length) return;
      const fileUri = res.assets[0].uri;
      // UTF-8 is default; no options needed (avoids TS error)
      const json = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(json);

      if (!data || !Array.isArray(data.users) || typeof data.habitsByEmail !== "object") {
        Alert.alert("Invalid file", "This backup file is not recognized.");
        return;
      }

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(data.users));
      for (const u of data.users as StoredUser[]) {
        await AsyncStorage.setItem(habitsKey(u.email), JSON.stringify(data.habitsByEmail[u.email] ?? []));
      }

      // Keep current user as-is; optionally refresh UI
      if (user) {
        const upd = (data.users as StoredUser[]).find(
          (u) => u.email.toLowerCase() === user.email.toLowerCase()
        );
        if (upd) {
          await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(upd));
          onUserChange?.(upd);
        }
      }

      Alert.alert("Import complete", "Backup restored.");
    } catch (e) {
      console.warn("Import failed", e);
      Alert.alert("Import failed", "Could not read backup file.");
    }
  };

  // ---------------- Delete account ----------------
  const deleteAccount = async () => {
    if (!user) return;

    Alert.alert(
      "Delete account?",
      "This will permanently delete your account and all your habits on this device. This can’t be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // remove from users list
              const raw = await AsyncStorage.getItem(USERS_KEY);
              const list: StoredUser[] = raw ? JSON.parse(raw) : [];
              const next = list.filter(
                (u) => u.email.toLowerCase() !== user.email.toLowerCase()
              );
              await AsyncStorage.setItem(USERS_KEY, JSON.stringify(next));

              // remove this user's habit bucket
              await AsyncStorage.removeItem(habitsKey(user.email));

              // remove current user
              await AsyncStorage.removeItem(CURRENT_USER_KEY);

              onUserChange?.(null);

              // reuse your existing logout flow/navigation
              await Promise.resolve(onLogout());
            } catch (e) {
              console.warn("Delete account failed", e);
              Alert.alert("Error", "Could not delete the account.");
            }
          },
        },
      ]
    );
  };

  // ---------------- UI Layout ----------------
  return (
    <Screen>

      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>{editing ? avatar : user?.avatar ?? "👤"}</Text>
          </View>

          <View style={{ flex: 1 }}>
            {!editing ? (
              <>
                <Text style={styles.profileName}>{user?.name ?? "Profile"}</Text>
                <Text style={styles.profileEmail}>{email}</Text>
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Name</Text>
                <TextField
                  label={undefined}                 
                  placeholder="Profile"
                  value={name}
                  onChangeText={setName}
                  containerStyle={styles.fieldShell} 
                  inputStyle={styles.fieldInput}     
                />

                {/* Email */}
                <Text style={[styles.inputLabel, { marginTop: spacing(1.5) }]}>Email</Text>
                <View style={styles.fieldShell}>
                  <Text
                    style={[styles.fieldText, styles.readonlyText]}
                    numberOfLines={1}
                  >
                    {email}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
        
        {/* Avatar selector in edit mode */}
        {editing && (
          <View style={{ marginTop: spacing(2) }}>
            <View style={styles.avatarGrid}>
              {AVATARS.map((a) => {
                const selected = a === avatar;
                return (
                  <TouchableOpacity
                    key={a}
                    onPress={() => setAvatar(a)}
                    activeOpacity={0.8}
                    style={[
                      styles.avatarChoice,
                      selected && { backgroundColor: colors.surface, borderColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.choiceEmoji}>{a}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* CTA Button*/}
        {!editing ? (
          <Button label="Edit Profile" onPress={() => setEditing(true)} />
        ) : (
          <Button label="Save Changes" onPress={saveProfile} disabled={!canSave} />
        )}
      </View>

      {/* Data Management */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <Pressable onPress={exportBackup} style={styles.actionCard}>
          <View style={styles.actionLeft}>
            <Feather name="download" size={18} color={colors.primary} />
            <Text style={styles.actionCardText}>Export Backup</Text>
          </View>
        </Pressable>

        <Pressable onPress={importBackup} style={[styles.actionCard, { marginTop: 10 }]}>
          <View style={styles.actionLeft}>
            <Feather name="upload" size={18} color={colors.primary} />
            <Text style={styles.actionCardText}>Import Backup</Text>
          </View>
        </Pressable>

        <Pressable onPress={deleteAccount} style={[styles.actionCard, { marginTop: 10 }]}>
          <View style={styles.actionLeft}>
            <Feather name="trash-2" size={18} color="#D00" />
            <Text style={[styles.actionCardText, { color: "#D00", fontWeight: "700" }]}>
              Delete Account
            </Text>
          </View>
        </Pressable>
      </View>
      
      {/* Logout */}
      <View style={styles.logoutCard}>
        <Pressable
          onPress={onLogout}
          style={{ alignItems: "center", paddingVertical: spacing(1.5) }}
        >
          <Text style={{ ...type.body, color: "#D00", fontWeight: "600" }}>Log Out</Text>
        </Pressable>
      </View>

      <Text style={styles.footerNote}>All data is stored locally</Text>
      <Text style={styles.footerNote}>Version 1.0.0</Text>
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
  },
  headerTitle: { 
    ...type.h2, 
    fontWeight: "600" 
  },

  card: {
    marginTop: spacing(2),
    marginHorizontal: spacing(2),
    padding: spacing(2),
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    gap: spacing(2),
  },

  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 32 },

  profileName: { 
    ...type.h2, 
    fontWeight: "600" 
  },
  profileEmail: { 
    ...type.small, 
    color: colors.mutedText, 
    marginTop: 2 
  },

  inputLabel: {
    ...type.small,
    color: colors.mutedText,
    marginTop: spacing(0.5),
  },

  fieldShell: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E6E6E6",
    borderWidth: 1,
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
  },

  fieldInput: {
    backgroundColor: "transparent",
    color: "#111111",
    paddingHorizontal: 14,
    height: 48,             
  },

  fieldText: {
    ...type.body,
    color: "#111111",
    paddingHorizontal: 14,
  },

  readonlyText: {
    color: colors.mutedText,
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  avatarChoice: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  choiceEmoji: { fontSize: 24 },

  sectionCard: {
    marginTop: spacing(2),
    marginHorizontal: spacing(2),
    padding: spacing(2),
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  sectionTitle: { 
    ...type.small, 
    color: colors.mutedText, 
    marginBottom: spacing(1) 
  },
  
  actionCard: {
    backgroundColor: colors.surfaceAlt, 
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  actionCardText: {
    ...type.body,
    color: colors.primary,
    fontWeight: "600",
  },

  logoutCard: {
    marginHorizontal: spacing(2),
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginTop: spacing(2),
  },

  footerNote: {
    ...type.small,
    color: colors.mutedText,
    textAlign: "center",
    marginTop: spacing(1),
  },
});
