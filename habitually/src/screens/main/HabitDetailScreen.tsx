import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Habit } from '../../types/types';
import HomeScreen from './HomeScreen';

export default function HabitDetailScreen({ navigation, route }: any) {
  const { habit } = route.params as { habit: Habit };

  // Generate current month days (30 days for simplicity)
  const generateMonthDays = () => {
    const days = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        day: i,
        dateString,
        completed: habit.completionDates.includes(dateString),
      });
    }
    return days;
  };

  const monthDays = generateMonthDays();
  const completedCount = monthDays.filter(d => d.completed).length;
  const successRate = Math.round((completedCount / monthDays.length) * 100);

  return (
    <ScrollView style={styles.container}>
      {/* Header with Edit Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('CreateHabit', { habit })}
        >
          <Text style={styles.editIcon}>❌</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('CreateHabit', { habit })}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{habit.name}</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{habit.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{successRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Month Calendar */}
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>Monthly Progress</Text>
        <View style={styles.calendar}>
          {monthDays.map((day) => (
            <View
              key={day.day}
              style={[
                styles.calendarDay,
                day.completed ? styles.completedDay : styles.incompleteDay,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  day.completed && styles.completedDayText,
                ]}
              >
                {day.day}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  editButton: {
    padding: 10,
  },
  editIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 20,
    borderRadius: 15,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  calendarContainer: {
    padding: 20,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '13.28%', // 7 days per row
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  completedDay: {
    backgroundColor: '#4CAF50',
  },
  incompleteDay: {
    backgroundColor: '#E0E0E0',
  },
  dayNumber: {
    fontSize: 12,
    color: '#666',
  },
  completedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});