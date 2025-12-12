import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Screen } from "../components/layout/Screen";
import { spacing, type, colors } from "../theme/tokens";
import { Habit } from "../types";
import { Feather } from "@expo/vector-icons";

type Props = {
  navigation: any;
  habits: Habit[];
  onAddHabitPress: () => void;
  onToggleToday: (id: string) => void;
};

export function HomeScreen({
  navigation,
  habits,
  onAddHabitPress,
  onToggleToday,
}: Props) {
  const today = new Date();
  const todayKey = today.toDateString();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const completedToday = habits.filter((h) =>
    h.completedDates.includes(todayKey)
  ).length;

  const totalStreaks = habits.reduce(
    (sum, h) => sum + (h.completedDates?.length || 0),
    0
  );

  const renderHabit = ({ item }: { item: Habit }) => {
    const doneToday = item.completedDates.includes(todayKey);
    const accent = item.color || "#111827";

    const timeLabel =
      item.timeRange.charAt(0).toUpperCase() + item.timeRange.slice(1);
    
    const streakDays = item.completedDates?.length || 0;
    const streakText = streakDays > 0 ? ` · ${streakDays} day${streakDays === 1 ? "" : "s"}` : "";

    return (
      <TouchableOpacity
        style={styles.habitCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("HabitDetail", { id: item.id })}
      >
        {/* Left status circle */}
        <TouchableOpacity
          style={[
            styles.statusCircle,
            { borderColor: accent },
            doneToday && { backgroundColor: accent },
          ]}
          activeOpacity={0.7}
          onPress={() => onToggleToday(item.id)}
        >
          {doneToday && <Feather name="check" size={16} color="#ffffff" />}
        </TouchableOpacity>
        
        <View style={styles.habitMain}>
          <View style={styles.titleRow}>
            <Text style={styles.habitEmoji}>{item.icon || "🏃"}</Text>
            <Text
              style={[styles.habitTitle, doneToday && styles.habitTitleDone]}
              numberOfLines={1}
           >
              {item.name}
            </Text>
          </View>

          <Text style={styles.habitTime}>
            {timeLabel}
            {streakText}
          </Text>
        </View>

        {/* Right “Mark/Done” text button */}
        <TouchableOpacity
          onPress={() => onToggleToday(item.id)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.markText, doneToday && styles.markTextDone]}
            numberOfLines={1}
          >
            {doneToday ? "Done" : "Mark"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Screen scroll={false}>
      <View style={styles.root}>

        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.title}>Habits</Text>

            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => navigation.navigate("Calendar")}
              >
                <Feather name="calendar" size={22} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => navigation.navigate("Settings")}
              >
                <Feather name="settings" size={22} color="#111827" />
              </TouchableOpacity>
            </View>
          </View>

            <Text style={styles.dateLine}>{weekday}</Text>
            <Text style={styles.dateLine}>{monthDay}</Text>
          </View>

        <View style={styles.middle}>
          {habits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySub}>
                Tap + to create your first habit
              </Text>
            </View>
          ) : (
            <FlatList
              data={habits}
              keyExtractor={(h) => h.id}
              renderItem={renderHabit}
              contentContainerStyle={{ paddingBottom: spacing(10), gap: spacing(1.5) }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.progressBar}>
          <View>
            <Text style={styles.progressLabel}>Today&apos;s Progress</Text>
            <Text style={styles.progressValue}>
              {completedToday} / {habits.length || 0}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.progressLabel}>Total Streaks</Text>
            <Text style={styles.progressValue}>{totalStreaks}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={onAddHabitPress}
          activeOpacity={0.85}
          >
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root:{
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(4),
    paddingBottom: spacing(1.8),
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",  
  },
  title: {
    ...type.h1,
    fontSize: 28,
  },
  dateLine: {
    ...type.small,
    fontSize: 16,
    color: colors.mutedText,
    marginTop: spacing(0.5),
  },
  iconRow: {
    flexDirection: "row",
    gap: spacing(2),
  },
  iconCircle: {
    width: 33,
    height: 33,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
  },

  // Middle Content
  middle: {
    flex: 1,
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
  },
  emptyContainer: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40, 
  },
  emptyTitle: {
    ...type.body,
    color: colors.mutedText,
    marginBottom: spacing(0.5),
  },
  emptySub: {
    ...type.small,
    color: colors.mutedText,
  },

  // Habit Card
  habitCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    borderRadius: 24,
    backgroundColor: colors.surface,
    marginBottom: spacing(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing(1.5),
    backgroundColor:"#ffffff",
  },
  habitMain: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  habitEmoji: {
    fontSize: 18,
  },
  habitTitle: {
    ...type.body,
    fontSize: 16,
    fontWeight: "600",
  },
  habitTitleDone: {
    color: colors.mutedText,
    textDecorationLine: "line-through",
  },
  habitTime: {
    ...type.small,
    color: colors.mutedText,
    marginTop: 2,
  },
  markText: {
    ...type.small,
    color: "#111827",
  },
  markTextDone: {
    color: colors.mutedText,
  },

  // Progress Bar Card
  progressBar: {
    position: "absolute",
    left: spacing(2),
    right: spacing(2),
    bottom: spacing(10),
    height: 70,
    backgroundColor: "black",
    borderRadius: 18,
    paddingHorizontal: spacing(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressLabel: {
    ...type.small,
    color: "#e5e5e5",
  },
  progressValue: {
    ...type.h2,
    color: "white",
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    right: spacing(2),
    bottom: spacing(2),
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabPlus: {
    color: "white",
    fontSize: 28,
    marginTop: -2,
  },
});
