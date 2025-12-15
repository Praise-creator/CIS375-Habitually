import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Pressable } from "react-native";
import { Screen } from "../components/layout/Screen";
import { spacing, type, colors } from "../theme/tokens";
import { Feather } from "@expo/vector-icons";
import { getMonthDate, buildMonthCells, toKey } from "../utils/calendarUtils";

type Habit = {
  id: string;
  name: string;
  icon?: string;   
  color: string;
  completedDates: string[]; 
};

type Props = {
  navigation: any;
  habits: Habit[];
};

const WEEK_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarScreen({ navigation, habits }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const baseDate = getMonthDate(monthOffset);

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0..11

  const monthLabel = baseDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const { cells } = useMemo(() => buildMonthCells(year, month), [year, month]);

  // selected day (default = today if in viewed month; else first day of month)
  const initialSelected = useMemo(() => {
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month) return today;
    return new Date(year, month, 1);
  }, [year, month]);

  const [selected, setSelected] = useState<Date>(initialSelected);

  // Completed count for a date
  const completedCount = (d: Date) => {
    const key = toKey(d);
    let n = 0;
    for (const h of habits) if (h.completedDates?.includes(key)) n++;
    return n;
  };

  const dayHabits = useMemo(() => {
    const key = toKey(selected);
    return habits.map((h) => ({
      ...h,
      done: h.completedDates?.includes(key),
    }));
  }, [habits, selected]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Month header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => {
          setMonthOffset((o) => o - 1);
          // keep selection inside new month
          const d = new Date(year, month - 1, Math.min(selected.getDate(), 28));
          setSelected(d);
        }}>
          <Feather name="chevron-left" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{monthLabel}</Text>

        <TouchableOpacity onPress={() => {
          setMonthOffset((o) => o + 1);
          const d = new Date(year, month + 1, Math.min(selected.getDate(), 28));
          setSelected(d);
        }}>
          <Feather name="chevron-right" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Weekday labels */}
      <View style={styles.weekdayRow}>
        {WEEK_LABELS.map((d, idx) => (
          <Text key={`${d}-${idx}`} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {cells.map((day, index) => {
          const isDay = day != null;
          const date = isDay ? new Date(year, month, day!) : null;
          const selectedThis = isDay
            ? (selected.getFullYear() === year &&
               selected.getMonth() === month &&
               selected.getDate() === day)
            : false;
          const count = isDay ? completedCount(date!) : 0;
          const filled = count > 0;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={isDay ? 0.7 : 1}
              onPress={() => {
                if (!isDay) return;
                setSelected(date!);
              }}
              style={styles.dayCell}
            >
              {isDay && (
                <View
                  style={[
                    styles.dayBubble,
                    selectedThis && styles.daySelected,
                    filled && styles.dayFilled,
                  ]}
                >
                  <Text style={[styles.dayText, filled && { color: "#fff" }]}>
                    {day}
                  </Text>
                  {/* count label to mimic screenshot; shown only if filled */}
                  <Text style={[styles.dayCount, filled ? { color: "#fff" } : { color: "transparent" }]}>
                    {filled ? count : "0"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected day details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {selected.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <View style={{ paddingVertical: 8 }}>
          {dayHabits.map((item, idx) => (
            <View key={item.id} style={{ marginBottom: idx === dayHabits.length - 1 ? 0 : 12 }}>
              <View style={styles.habitRow}>
                <View style={styles.habitLeft}>
                  <View style={styles.emojiWrap}>
                    <Text style={styles.emoji}>{item.icon || "•"}</Text>
                  </View>
                  <Text style={styles.habitName}>{item.name}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.done ? { backgroundColor: "#34C759" } : { backgroundColor: "#F4A026" },
                  ]}
                >
                  <Feather name={item.done ? "check" : "clock"} size={16} color="#fff" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const CELL_W = 32;

const styles = StyleSheet.create({
  headerRow: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing(2),
  },
  header:{
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
  monthLabel: {
    ...type.body,
    fontWeight: "600",
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing(2),
    marginBottom: spacing(1),
  },
  weekday: {
    width: CELL_W,
    textAlign: "center",
    ...type.small,
    color: colors.mutedText,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing(2),
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    marginVertical: spacing(0.5),
  },
  dayBubble: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  dayText: {
    ...type.body,
    fontWeight: "600",
  },
  dayCount: {
    ...type.small,
    marginTop: 2,
  },
  daySelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayFilled: {
    backgroundColor: "#111111",
  },
  card: {
    marginTop: spacing(2),
    marginHorizontal: spacing(2),
    padding: spacing(2),
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
  },
  cardTitle: { ...type.h2, fontWeight: "600", marginBottom: spacing(1) },

  habitRow: {
    height: 64,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  habitLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  emojiWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 18 },
  habitName: { ...type.body },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CalendarScreen;
