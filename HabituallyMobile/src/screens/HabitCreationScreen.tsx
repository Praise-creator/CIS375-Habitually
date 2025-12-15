import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  //Platform,
  Pressable,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
//import DateTimePicker, { DateTimePickerEvent} from "@react-native-community/datetimepicker";

import { Screen } from "../components/layout/Screen";
import { TextField } from "../components/ui/TextField";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { spacing, type, colors } from "../theme/tokens";
import { Habit, TimeRange, RecurrenceType } from "../types";
import { Feather } from "@expo/vector-icons";

type Props = {
  navigation: any;
  route?: any;
  onSave?: (habit: Omit<Habit, "id" | "createdAt" | "completedDates">) => void;
  onCreateHabit?: (habit: Omit<Habit, "id" | "createdAt" | "completedDates">) => void;
  onCancel?: () => void;
};

const ICON_OPTIONS = [
  "🏃‍♀️",
  "📚",
  "💧",
  "🧘‍♀️",
  "💪",
  "🎵",
  "✍️",
  "🍎",
  "🎧",
  "🛏️",
  "🎨",
  "🌱",
];

const COLOR_OPTIONS = [
  "#F97373",
  "#FBBF24",
  "#F58F0F",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#0C8DA8",
];

/*
function defaultNineAM() {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d;
}*/

/** ---------- Typed time input helpers ---------- */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * TimeField
 * - value: "hh:mm AM"    (string)
 * - onChange: (s) => void
 * Behavior:
 * - User can type partial digits without being auto-corrected mid-typing.
 * - On blur (leaving a box) we clamp + pad to valid ranges.
 * - AM/PM toggled by tapping the chip.
 */
export function TimeField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  // Parse incoming value (keep default 09:00 AM if malformed)
  const parse = (v: string) => {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(v || "");
    return m
      ? { hh: m[1], mm: m[2], ap: m[3].toUpperCase() as "AM" | "PM" }
      : { hh: "09", mm: "00", ap: "AM" as const };
  };

  const [hh, setHH] = useState(parse(value).hh);
  const [mm, setMM] = useState(parse(value).mm);
  const [ap, setAP] = useState<"AM" | "PM">(parse(value).ap);

  // Keep internal state in sync if the parent changes externally
  useEffect(() => {
    const p = parse(value);
    if (p.hh !== hh) setHH(p.hh);
    if (p.mm !== mm) setMM(p.mm);
    if (p.ap !== ap) setAP(p.ap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Normalize + emit
  const emit = (h: string, m: string, a: "AM" | "PM") => onChange(`${h}:${m} ${a}`);

  const onBlurHH = () => {
    const n = hh.replace(/\D/g, "");
    if (!n) return emit("01", mm || "00", ap);
    const clamped = clamp(parseInt(n, 10), 1, 12);
    const padded = pad2(clamped);
    setHH(padded);
    emit(padded, (mm && mm.length === 2 ? mm : pad2(parseInt(mm || "0"))) || "00", ap);
  };

  const onBlurMM = () => {
    const n = mm.replace(/\D/g, "");
    if (!n) return emit(hh || "09", "00", ap);
    const clamped = clamp(parseInt(n, 10), 0, 59);
    const padded = pad2(clamped);
    setMM(padded);
    emit((hh && hh.length === 2 ? hh : pad2(parseInt(hh || "9"))) || "09", padded, ap);
  };

  const toggleAP = () => {
    const next = ap === "AM" ? "PM" : "AM";
    setAP(next);
    // Emit with current (normalized) digits
    const h = (hh && hh.length === 2 ? hh : pad2(parseInt(hh || "9"))) || "09";
    const m = (mm && mm.length === 2 ? mm : pad2(parseInt(mm || "0"))) || "00";
    emit(h, m, next);
  };

  return (
    <View style={[stylesTF.row, disabled && { opacity: 0.5 }]}>
      <TextInput
        editable={!disabled}
        keyboardType="number-pad"
        value={hh}
        onChangeText={(t) => setHH(t.replace(/\D/g, "").slice(0, 2))}
        onBlur={onBlurHH}
        placeholder="HH"
        style={stylesTF.box}
      />
      <Text style={stylesTF.colon}>:</Text>
      <TextInput
        editable={!disabled}
        keyboardType="number-pad"
        value={mm}
        onChangeText={(t) => setMM(t.replace(/\D/g, "").slice(0, 2))}
        onBlur={onBlurMM}
        placeholder="MM"
        style={stylesTF.box}
      />
      <Pressable onPress={disabled ? undefined : toggleAP} style={stylesTF.apChip}>
        <Text style={stylesTF.apText}>{ap}</Text>
      </Pressable>
    </View>
  );
}

const stylesTF = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  box: {
    width: 56,
    height: 44,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: "#fff",
    textAlign: "center",
    ...type.body,
  },
  colon: { ...type.h2, marginHorizontal: 2 },
  apChip: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  apText: { ...type.body, fontWeight: "600" },
});

export function HabitCreationScreen({ navigation, onSave, onCreateHabit, onCancel }: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>("morning");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("daily");

  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  //const [reminderTime, setReminderTime] = useState<Date | null>(null);
  //const [reminderTime, setReminderTime] = useState<Date>(defaultNineAM());
  const [reminderTime, setReminderTime] = useState<string>("09:00 AM");
  //const [showTimePicker, setShowTimePicker] = useState(false);

  // --- Repeat details state ---
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]); // 0=Sun..6=Sat
  const [monthlyDay, setMonthlyDay] = useState<number>(1);    // 1..31
  const [intervalDays, setIntervalDays] = useState<number>(1);

  // tiny helpers
  const toggleWeekly = (dow: number) =>
    setWeeklyDays((prev) =>
      prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow]
    );
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  // Time picker handling logic
  /**
  const handleToggleReminder = (value: boolean) => {
    setReminderEnabled(value);

    if (value) {
      // Turning ON: if we don't have a time yet, default to 9:00 AM.
      //setReminderTime(prev => prev ?? defaultNineAM());
      setReminderTime(defaultNineAM());
      // Do NOT show picker yet – only when user taps the box.
      //setShowTimePicker(false);
    } else {
      // Turning OFF: hide picker + clear time.
      setShowTimePicker(false);
      //setReminderTime(null);
    }
  };

  const handleTimeFieldPress = () => {
    if (!reminderEnabled) return;
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      setReminderTime(date);
    }

    if (Platform.OS === "android") {
      // close picker after a selection / cancel on Android
      setShowTimePicker(false);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  */

  const cancel = () => {
    if (onCancel) onCancel();
    safeBack();
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    // final validation for typed time if reminder is ON
    if (reminderEnabled && !/^((0?[1-9])|(1[0-2])):[0-5]\d\s(AM|PM)$/.test(reminderTime)) {
      Alert.alert("Invalid time", "Please enter a time like 09:05 AM");
      return;
    }
    
    // build recurrence object with details; cast as 'any' to be TS-safe with your current types
    const rec: any = { type: recurrence };
    if (recurrence === "weekly") {
      rec.daysOfWeek = weeklyDays.sort();         // e.g., [1,2,3,4,5]
    }
    if (recurrence === "monthly") {
      rec.dayOfMonth = clamp(monthlyDay, 1, 31);  // 1..31
    }
    if (recurrence === "interval") {
      rec.everyDays = Math.max(1, Math.floor(intervalDays || 1)); // >=1
    }

    const payload: Omit<Habit, "id" | "createdAt" | "completedDates"> = {
      name: name.trim(),
      icon,
      color,
      timeRange,
      reminder: reminderEnabled,
      //reminderTime: reminderEnabled ? reminderTime.toISOString() : undefined,
      reminderTime: reminderEnabled ? reminderTime : undefined,
      //recurrence: { type: recurrence },
      recurrence: rec as any,
    };

    if (onSave) onSave(payload);
    else if (onCreateHabit) onCreateHabit(payload);

    safeBack();
  };
  
  //const reminderDisplay = reminderEnabled ? formatTime(reminderTime) : "";

  // choose a route in your stack as the fallback destination
  /**
  const FALLBACK_ROUTE = "HomeScreen"; 

  const safeBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      // replace to avoid stacking duplicates if user lands here directly
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: FALLBACK_ROUTE }],
        })
      );
    }
  };
  */

  const safeBack = () => {
    // 1) If there's a screen to go back to, just pop.
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    // 2) Otherwise, pick an existing route from this navigator (prefer "Home").
    const routeNames: string[] =
      navigation?.getState?.()?.routeNames ??
      navigation?.getRootState?.()?.routeNames ??
      [];

    const fallbackName =
      routeNames.find((n) => /home/i.test(n)) || // "Home", "HomeTab", etc.
      routeNames[0];                              // first available route

    if (fallbackName) {
      navigation.dispatch(CommonActions.navigate({ name: fallbackName }));
    }
    // If nothing exists, do nothing—avoids warnings.
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable hitSlop={8} onPress={safeBack}>
          {/* was "chevron-left" */}
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>New Habit</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        
        <TextField
          label="Habit Name"
          placeholder="e.g. Morning run"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.sectionTitle}>Icon</Text>
        <View style={styles.iconRow}>
          {ICON_OPTIONS.map((ic) => (
            <TouchableOpacity
              key={ic}
              style={[
                styles.iconChip,
                ic === icon && styles.iconChipSelected,
              ]}
              onPress={() => setIcon(ic)}
              activeOpacity={0.8}
            >
              <Text style={styles.iconEmoji}>{ic}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Color</Text>
        <View style={styles.colorRow}>
          {COLOR_OPTIONS.map((c) => (
            <TouchableOpacity key={c} onPress={() => setColor(c)}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  c === color && styles.colorDotSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* REMINDER */}
        {/* Comment part: timepicker logic */}
        <View style={styles.reminderRow}>
          <Text style={styles.reminderLabel}>Reminder</Text>
          <Switch
            value={reminderEnabled}
            //onValueChange={handleToggleReminder}
            onValueChange={(v) => {
              setReminderEnabled(v);
              //if (v) setReminderTime(defaultNineAM());
              if (v && !reminderTime) setReminderTime("09:00 AM");
              //setShowTimePicker(false);
            }}
            trackColor={{ false: "#E5E5E5", true: "#111111" }}
            thumbColor="#ffffff"
          />
        </View>

        {reminderEnabled && (
          <View style={{ marginTop: spacing(1) }}>
            <TimeField value={reminderTime} onChange={setReminderTime} />
          </View>
        )}       

        {/** 
        {reminderEnabled && (
          <View style={styles.reminderFieldWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.reminderField}
              onPress={handleTimeFieldPress}
            >
              <Text style={styles.reminderTimeText}>
                {formatTime(reminderTime)}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <View style={styles.timePickerOverlay}>
                <DateTimePicker
                  //value={reminderTime ?? defaultNineAM()}
                  value={reminderTime}
                  mode="time"
                  //onChange={handleTimeChange}
                  onChange={(event, date) => {
                    if (event.type === "set" && date) {
                       setReminderTime(date);
                    }
                    setShowTimePicker(false);
                   }}
                />
              </View>
            )} */}

        {/* TIME OF DAY */}
        <Text style={styles.sectionTitle}>Time of Day</Text>
        <View style={styles.chipRow}>
          <Chip
            label="Morning"
            selected={timeRange === "morning"}
            onPress={() => setTimeRange("morning")}
            style={styles.chip}
          />
          <Chip
            label="Afternoon"
            selected={timeRange === "afternoon"}
            onPress={() => setTimeRange("afternoon")}
            style={styles.chip}
          />
        </View>
        <View style={styles.chipRow}>
          <Chip
            label="Evening"
            selected={timeRange === "evening"}
            onPress={() => setTimeRange("evening")}
            style={styles.chip}
          />
          <Chip
            label="Anytime"
            selected={timeRange === "anytime"}
            onPress={() => setTimeRange("anytime")}
            style={styles.chip}
          />
        </View>

        {/* REPEAT */}
        <Text style={styles.sectionTitle}>Repeat</Text>

        <View style={styles.chipRow}>
          <Chip
            label="Daily"
            selected={recurrence === "daily"}
            onPress={() => setRecurrence("daily")}
            style={styles.chip}
          />
          <Chip
            label="Weekly"
            selected={recurrence === "weekly"}
            onPress={() => setRecurrence("weekly")}
            style={styles.chip}
          />
        </View>
        <View style={styles.chipRow}>
          <Chip
            label="Monthly"
            selected={recurrence === "monthly"}
            onPress={() => setRecurrence("monthly")}
            style={styles.chip}
          />
          <Chip
            label="Interval"
            selected={recurrence === "interval"}
            onPress={() => setRecurrence("interval")}
            style={styles.chip}
          />
        </View>

        {/* WEEKLY: weekday selector (S M T W T F S) */}
        {recurrence === "weekly" && (
          <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
            {["S","M","T","W","T","F","S"].map((label, idx) => {
              const selected = weeklyDays.includes(idx);
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleWeekly(idx)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.weekDot,
                    selected ? styles.weekDotOn : styles.weekDotOff
                  ]}>
                    <Text style={[selected ? styles.weekDotTextOn : styles.weekDotTextOff]}>
                      {label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* MONTHLY: Day of month spinner-like input */}
        {recurrence === "monthly" && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Day of month</Text>
            <View style={styles.spinWrap}>
              <TextInput
                value={String(monthlyDay)}
                onChangeText={(t) => {
                  const n = parseInt(t.replace(/\D/g, "") || "1", 10);
                  setMonthlyDay(clamp(n, 1, 31));
                }}
                keyboardType="number-pad"
                style={styles.spinInput}
              />
              <View style={styles.spinArrows}>
                <Pressable onPress={() => setMonthlyDay((n) => clamp(n + 1, 1, 31))}>
                  <Feather name="chevron-up" size={16} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => setMonthlyDay((n) => clamp(n - 1, 1, 31))}>
                  <Feather name="chevron-down" size={16} color={colors.primary} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* INTERVAL: Every X days spinner-like input */}
        {recurrence === "interval" && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Every X days</Text>
            <View style={styles.spinWrap}>
              <TextInput
                value={String(intervalDays)}
                onChangeText={(t) => {
                  const n = parseInt(t.replace(/\D/g, "") || "1", 10);
                  setIntervalDays(Math.max(1, n));
                }}
                keyboardType="number-pad"
                style={styles.spinInput}
              />
              <View style={styles.spinArrows}>
                <Pressable onPress={() => setIntervalDays((n) => Math.max(1, n + 1))}>
                  <Feather name="chevron-up" size={16} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => setIntervalDays((n) => Math.max(1, n - 1))}>
                  <Feather name="chevron-down" size={16} color={colors.primary} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={{ marginTop: spacing(3), gap: spacing(1) }}>
          <Button
            label="Save Habit"
            onPress={handleSubmit}
            disabled={!name.trim()}
          />
          <Button label="Cancel" variant="secondary" onPress={onCancel} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  backArrow: {
    fontSize: 20,
    color: "#111111",
  },
  headerTitle: {
    ...type.h2,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#111111",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(2),
    paddingTop: spacing(1),
  },
  sectionTitle: {
    ...type.small,
    color: colors.mutedText,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },

  // Icon selection
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing(0.5),
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  iconChipSelected: {
    backgroundColor: "#111111",
  },
  iconEmoji: {
    fontSize: 24,
  },

  // Color selection
  colorRow: {
    flexDirection: "row",
    gap: spacing(1),
    marginBottom: spacing(2),
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorDotSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  // Chips
  chip: {
    flex: 1,
    marginRight: spacing(1),
  }, 
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing(1),
  },
  chipBase: {
    flex: 1,
    paddingVertical: spacing(1.25),
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing(1),
  },
  chipSelected: {
    backgroundColor: "#111111",
  },
  chipText: {
    ...type.body,
    color: colors.primaryText,
  },
  chipTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },

  // Reminder
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //marginTop: spacing(1),
    marginTop: 12,
    marginBottom: 8,
  },
  reminderLabel: {
    fontSize: 14,
    color: "#666666",
    //marginBottom: 8,
  },
  reminderFieldWrapper: {
    position: "relative",
    marginTop: 10,
  },
  reminderField: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  reminderTimeText: {
    ...type.body,
    color: "#111111",
  },
  reminderPlaceholder: {
    color: colors.mutedText,
  },
  timePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 4,
    zIndex: 50,
  },

  weekDot: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  weekDotOff: { backgroundColor: colors.surfaceAlt },
  weekDotOn:  { backgroundColor: "#111111" },
  weekDotText: { ...type.body, color: colors.primaryText },
  weekDotTextOff: {
    // unselected letter = black (high contrast)
    color: "#111111",
    ...type.body,
    fontWeight: "600",
  },
  weekDotTextOn: {
    // selected letter = white
    color: "#ffffff",
    ...type.body,
    fontWeight: "600",
  },


  spinWrap: {
    position: "relative",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
    backgroundColor: "#FFFFFF",
  },
  spinInput: {
    height: 48,
    paddingLeft: 16,
    paddingRight: 44, 
    ...type.body,
  },
  spinArrows: {
    position: "absolute",
    right: 10,
    top: 6,
    bottom: 6,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

});
