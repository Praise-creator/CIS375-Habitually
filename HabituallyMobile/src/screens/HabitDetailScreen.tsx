import React, { useMemo, useState, useCallback} from "react";
import { View, Text, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import { Screen } from "../components/layout/Screen";
import { spacing, type, colors } from "../theme/tokens";
import { Habit, Recurrence } from "../types";
import { Feather } from "@expo/vector-icons";

type Props = {
  navigation: any;
  route: { params?: { id?: string; habitId?: string } } | any;
  habits: Habit[];
  onToggleToday?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdateHabit?: (h: Habit) => void;
  onDeleteHabit?: (id: string) => void;
};

// Helper functions: habit details
const todayKey = () => new Date().toDateString();
const isDoneOn = (h: Habit, d: Date) => h.completedDates?.includes(d.toDateString());
const startOfWeekMon = (d = new Date()) => { const t = new Date(d); const day = (t.getDay()+6)%7; t.setDate(t.getDate()-day); return t; };
const addDays = (d: Date, n: number) => { const t = new Date(d); t.setDate(t.getDate()+n); return t; };

/*
const formatRecurrence = (r: Recurrence) =>
  r.type === "daily" ? "Daily"
  : r.type === "weekly" ? "Weekly"
  : r.type === "monthly" ? "Monthly"
  : r.intervalDays ? `Every ${r.intervalDays} days` : "Interval";
*/

// Helper function: create RGBA with alpha
function withAlpha(hex: string, alpha = 0.22) {
  const h = hex.replace("#","");
  const short = h.length === 3;
  const r = parseInt(short ? h[0]+h[0] : h.slice(0,2),16);
  const g = parseInt(short ? h[1]+h[1] : h.slice(2,4),16);
  const b = parseInt(short ? h[2]+h[2] : h.slice(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// CTA button
function CTA({
  label, filledColor, isDone, onPress,
}: { label: string; filledColor: string; isDone: boolean; onPress: () => void; }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.ctaBase,
        isDone
          ? { backgroundColor: colors.surfaceAlt, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }
          : { backgroundColor: filledColor },
      ]}
    >
      <Text style={[{ ...type.body, fontWeight: "600" }, isDone ? { color: colors.mutedText } : { color: "#fff" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ---- Recurrence formatter (works with our HabitCreation payload) ----
const WEEKDAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function formatRecurrence(rec: any): string {
  if (!rec) return "Daily";

  // tolerate older shapes: string or different keys
  if (typeof rec === "string") {
    if (rec === "daily")   return "Daily";
    if (rec === "weekly")  return "Weekly";
    if (rec === "monthly") return "Monthly";
    if (rec === "interval") return "Interval";
    return String(rec);
  }

  const type = rec.type || rec?.kind || rec?.mode; // tolerate legacy shapes
  switch (type) {
    case "daily":
      return "Daily";

    case "weekly": {
      const dows: number[] = Array.isArray(rec.daysOfWeek) ? rec.daysOfWeek : [];
      if (dows.length === 7) return "Daily";
      if (!dows.length) return "Weekly";
      return dows.map((d) => WEEKDAY_NAMES[d]).join(", ");
    }

    case "monthly": {
      const day = Number(rec.dayOfMonth || rec.day);
      return day >= 1 && day <= 31 ? `Day ${day} each month` : "Monthly";
    }

    case "interval": {
      const n = Math.max(1, Number(rec.everyDays || rec.every || 1));
      return `Every ${n} day${n > 1 ? "s" : ""}`;
    }

    default:
      // Fallback for any older/unknown value
      try {
        return String(type || rec);
      } catch {
        return "Schedule";
      }
  }
}

export function HabitDetailScreen(props: Props) {
  const { navigation, route, habits } = props;
  const habitId: string | undefined = route?.params?.id ?? route?.params?.habitId;
  const habit = habits.find((h) => h.id === habitId);

  // Guard: not found
  if (!habit) {
    return (
      <Screen>
        <View style={{ paddingHorizontal: spacing(2), paddingTop: spacing(2) }}>
          <Text style={{ ...type.body, color: colors.mutedText }}>Habit not found.</Text>
        </View>
      </Screen>
    );
  }

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Habit>(habit);
  const tintColor = editing ? draft.color : habit.color;

  const model = editing ? draft : habit;                 
  const doneToday = model.completedDates.includes(todayKey());

  // Stats
  const { currentStreak, totalDays } = useMemo(() => {
    let streak = 0;
    for (let i = 0; ; i++) {
      const d = addDays(new Date(), -i);
      if (model.completedDates.includes(d.toDateString())) streak++; else break;
    }
    return { currentStreak: streak, totalDays: model.completedDates.length };
  }, [model]);

  // Week (Mon–Sun)
  const week = useMemo(() => {
    const labels = ["M","T","W","T","F","S","S"];
    const start = startOfWeekMon();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(start, i);
      return { label: labels[i], num: d.getDate(), filled: model.completedDates.includes(d.toDateString()) };
    });
  }, [model]);

  const timeLabel = model.timeRange.charAt(0).toUpperCase() + model.timeRange.slice(1);

  // Toggle/Undo today
  const handleToggleToday = () => {
    const key = todayKey();

    if (editing) {
      const exists = draft.completedDates.includes(key);
      setDraft({
        ...draft,
        completedDates: exists
          ? draft.completedDates.filter((d) => d !== key)
          : [...draft.completedDates, key],
      });
      return;
    }
      // existing behavior when not editing
    if (props.onToggleToday) return props.onToggleToday(habit.id);
    if (props.onUpdateHabit) {
      const exists = habit.completedDates.includes(key);
      props.onUpdateHabit({
        ...habit,
        completedDates: exists
          ? habit.completedDates.filter((d) => d !== key)
          : [...habit.completedDates, key],
      });
    }
  };

  const handleDelete = () => {
    if (props.onDelete) return props.onDelete(habit.id);
    if (props.onDeleteHabit) return props.onDeleteHabit(habit.id);
  };

  const saveEdits = () => {
    if (props.onUpdateHabit) props.onUpdateHabit(draft);
    setEditing(false);
  };

  const EMOJIS = [ 
      "🏃‍♀️",
      "📚",
      "💧",
      "🧘‍♀️",
      "💪",
      "🎨",
      "🎵",
      "✍️",
      "🌱",
      "🍎",
      "🎧",
      "🛏️",
    ];

  const COLORS = [
      "#F97373",
      "#FBBF24",
      "#F58F0F",
      "#22C55E",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
      "#0C8DA8",
    ];
  
  const handleBack = useCallback(() => {
    if (editing) {
      setEditing(false);     // leave edit mode
      setDraft(habit);       // reset any unsaved changes
    } else {
      navigation.goBack();   // normal back
    }
  }, [editing, habit, navigation]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={handleBack}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </Pressable>
        {editing ? (
          <Pressable onPress={saveEdits} style={styles.savePill}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        ) : (
          <Pressable hitSlop={8} onPress={() => { setDraft(habit); setEditing(true); }}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.hero}>
        <View style={styles.emojiWrap}>
          <Text style={styles.emoji}>{(editing ? draft.icon : habit.icon) || "🏃‍♀️"}</Text>
        </View>
        {editing ? (
          <TextInput
            value={draft.name}
            onChangeText={(t) => setDraft({ ...draft, name: t })}
            placeholder="Habit name"
            style={styles.nameInput}
          />
        ) : (
          <>
            <Text style={styles.title}>{habit.name}</Text>
            <Text style={styles.subtitle}>{timeLabel}</Text>
          </>
        )}
      </View>

      {/* Edit controls */}
      {editing && (
        <>
          <View style={styles.gridRow}>
            {EMOJIS.map((e) => (
              <Pressable key={e} onPress={() => setDraft({ ...draft, icon: e })} style={[styles.iconCell, draft.icon === e && styles.iconCellSelected]}>
                <Text style={styles.iconCellText}>{e}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <Pressable key={c} onPress={() => setDraft({ ...draft, color: c })} style={[styles.colorDot, { backgroundColor: c }, draft.color === c && styles.colorDotSelected]} />
            ))}
          </View>
        </>
      )}

      {/* CTA */}
      <CTA
        label={doneToday ? "Completed Today" : "Mark as Done Today"}
        filledColor={tintColor}
        isDone={doneToday}
        onPress={handleToggleToday}
      />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statHeading}>Current Streak</Text>
          <Text style={styles.statNumber}>{currentStreak}</Text>
          <Text style={styles.statHint}>days</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statHeading}>Total Days</Text>
          <Text style={styles.statNumber}>{totalDays}</Text>
          <Text style={styles.statHint}>completed</Text>
        </View>
      </View>

      {/* This Week */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekRow}>
          {week.map((day, idx) => (
            <View
              key={`${day.label}-${idx}`}
              style={[
                styles.dayPill,
                day.filled
                  ? {
                      backgroundColor: withAlpha(tintColor, 0.22),
                      borderWidth: 1,
                      borderColor: tintColor,
                    }
                  : null,
              ]}
            >
              <Text style={styles.dayTop}>{day.label}</Text>
              <Text style={styles.dayNum}>{day.num}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Schedule */}
      <View style={styles.scheduleCard}>
        <Text style={styles.scheduleTitle}>Schedule</Text>
        <Text style={styles.scheduleValue}>{formatRecurrence(model.recurrence)}</Text>

        {/* Reminder */}
        {!!model.reminder && !!model.reminderTime && (
          <Text style={[styles.scheduleValue, { marginTop: 6 }]}>
            Reminder at {model.reminderTime}
          </Text>
        )}
      </View>

      {/* Delete */}
      <Pressable
        style={styles.delete}
        onPress={() =>
          Alert.alert("Delete Habit", "This cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: handleDelete },
          ])
        }
      >
        <Feather name="trash-2" size={16} color={colors.danger} />
        <Text style={styles.deleteText}>Delete Habit</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({

  // Header
  header: { 
    height: 48, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    paddingHorizontal: spacing(1)
  },

  // Edit text
  editText: { 
    ...type.small, 
    fontSize: 16,
    color: colors.primary, 
    fontWeight: "600", 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
  },

  // Save pill
  savePill: { 
    paddingHorizontal: 12, 
    paddingVertical: 7, 
    borderRadius: 12, 
    backgroundColor: colors.primary
  },
  saveText: { 
    ...type.small, 
    fontSize: 16,
    color: "#fff", 
    fontWeight: "600" 
  },

  // Hero
  hero: { 
    alignItems: "center", 
    marginTop: spacing(1.5) 
  },
  emojiWrap: { 
    borderRadius: 16, 
    padding: 12, 
    backgroundColor: "transparent" 
  },
  emoji: { 
    fontSize: 44 
  },
  title: { 
    ...type.h1, 
    marginTop: spacing(2) 
  },
  subtitle: { 
    ...type.small, 
    color: colors.mutedText, 
    marginTop: 8 
  },

  // Edit controls
  nameInput: {
    width: "100%", 
    marginTop: spacing(1), 
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth, 
    borderColor: colors.border,
    backgroundColor: "#fff", 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    ...type.body,
  },

  // Icon grid
  gridRow: { 
    marginTop: spacing(1.5), 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: spacing(1), 
    justifyContent: "space-between" 
  },
  iconCell: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, 
    backgroundColor: colors.surfaceAlt, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  iconCellSelected: { 
    backgroundColor: "#111111" 
  },
  iconCellText: { 
    fontSize: 24 
  },

  // Color grid
  colorRow: { 
    marginTop: spacing(2), 
    //marginBottom: spacing(2),
    flexDirection: "row", 
    gap: 15,
    justifyContent: "space-between",

  },
  colorDot: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    borderWidth: 2, 
    borderColor: "transparent" 
  },
  colorDotSelected: { 
    borderColor: "#111111" 
  },

  ctaBase: { 
    borderRadius: 16, 
    paddingVertical: 14, 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: spacing(2) 
  },

  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: spacing(2), 
    gap: spacing(1) 
  },
  statCard: { 
    flex: 1, 
    backgroundColor: 
    colors.surfaceAlt, 
    borderRadius: 12, 
    paddingVertical: 14, 
    paddingHorizontal: 12, 
    alignItems: "center",

  },
  statHeading: { 
    ...type.small, 
    color: colors.mutedText, 
    marginBottom: 4 
  },
  statNumber: { 
    ...type.h1, 
    fontWeight: "700" 
  },
  statHint: { 
    ...type.small, 
    color: colors.mutedText, 
    marginTop: 2 
  },

  // Sections
  section: { 
    marginTop: spacing(2) 
  },
  sectionTitle: {
     ...type.h2, 
     fontWeight: "600", 
     marginBottom: 8 
  },

  // Week
  weekRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginTop: spacing(0.5)
  },
  dayPill: { 
    width: 44, 
    height: 56, 
    borderRadius: 12, 
    backgroundColor: colors.surfaceAlt, 
    alignItems: "center", 
    justifyContent: "center" },
  dayTop: { 
    ...type.small, 
    color: colors.mutedText, 
    marginBottom: 2 },
  dayNum: { 
    ...type.body, 
    fontWeight: "600" 
  },

  // Schedule Card
  scheduleCard: { 
    marginTop: spacing(2), 
    backgroundColor: colors.surfaceAlt, 
    borderRadius: 12, 
    padding: 14 
  },
  scheduleTitle: { 
    ...type.small, 
    color: colors.mutedText, 
    marginBottom: 6 
  },
  scheduleValue: { 
    ...type.body 
  },

  // Delete
  delete: { 
    marginTop: spacing(2), 
    backgroundColor: "#FDECEC", 
    borderRadius: 12, 
    paddingVertical: 14, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 8 
  },
  deleteText: { 
    ...type.body, 
    fontWeight: "600", 
    color: colors.danger 
  },
});
