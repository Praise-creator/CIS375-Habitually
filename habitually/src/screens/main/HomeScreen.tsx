import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Habit } from '../../types/types';
import { loadHabits, saveHabits } from '../../utils/storage';

export default function HomeScreen({ navigation }: any) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [totalStreak, setTotalStreak] = useState(0);

  // Load habits when screen opens
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHabitsFromStorage();
    });
    return unsubscribe;
  }, [navigation]);

  // Recalculate when habits change
  useEffect(() => {
    calculateTotalStreak();
  }, [habits]);

  const loadHabitsFromStorage = async () => {
    const loadedHabits = await loadHabits();
    
    // If no habits exist, create a default one
    if (loadedHabits.length === 0) {
      const defaultHabit: Habit = {
        id: Date.now().toString(),
        userId: 'default-user',
        name: 'Drink Water',
        priority: 'high',
        time: '08:00',
        reminderEnabled: true,
        createdAt: new Date(),
        streak: 5,
        completionDates: getLast7Days().slice(0, 5), // Completed 5 of last 7 days
      };
      const newHabits = [defaultHabit];
      await saveHabits(newHabits);
      setHabits(newHabits);
    } else {
      setHabits(loadedHabits);
    }
  };

  const calculateTotalStreak = () => {
    const total = habits.reduce((sum, habit) => sum + habit.streak, 0);
    setTotalStreak(total);
  };

  // Generate last 7 days as ISO strings
  const getLast7Days = (): string[] => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  // Toggle habit completion for today
  const toggleHabitCompletion = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completionDates.includes(today);
        
        let newCompletionDates;
        let newStreak;
        
        if (isCompleted) {
          // Remove today's date
          newCompletionDates = habit.completionDates.filter(d => d !== today);
          newStreak = Math.max(0, habit.streak - 1);
        } else {
          // Add today's date
          newCompletionDates = [...habit.completionDates, today];
          newStreak = habit.streak + 1;
        }
        
        return {
          ...habit,
          completionDates: newCompletionDates,
          streak: newStreak,
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedHabits = habits.filter(h => h.id !== habitId);
            setHabits(updatedHabits);
            await saveHabits(updatedHabits);
          },
        },
      ]
    );
  };

  const renderHabit = ({ item }: { item: Habit }) => {
    const last7Days = getLast7Days();
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = item.completionDates.includes(today);

    return (
      <View style={styles.habitCard}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('HabitDetail', { habit: item })}
          onLongPress={() => deleteHabit(item.id)}
        >
          <View style={styles.habitHeader}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.habitStreak}>🔥 {item.streak} days</Text>
          </View>
          <Text style={styles.habitPriority}>
            Priority: {item.priority} • {item.time}
          </Text>

          {/* Mini calendar view for last 7 days */}
          <View style={styles.miniCalendar}>
            <Text style={styles.calendarText}>Last 7 Days</Text>
            <View style={styles.calendarDots}>
              {last7Days.map((day) => {
                const isCompleted = item.completionDates.includes(day);
                return (
                  <View
                    key={day}
                    style={[
                      styles.dayDot,
                      isCompleted ? styles.completedDot : styles.incompleteDot,
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </TouchableOpacity>

        {/* Toggle completion button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompletedToday && styles.completeButtonActive,
          ]}
          onPress={() => toggleHabitCompletion(item.id)}
        >
          <Text style={[
            styles.completeButtonText,
            isCompletedToday && styles.completeButtonTextActive,
          ]}>
            {isCompletedToday ? '✓ Completed Today' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Habits</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Streak View */}
      <View style={styles.streakView}>
        <Text style={styles.streakTitle}>Total Streak</Text>
        <Text style={styles.streakNumber}>{totalStreak} Days 🔥</Text>
      </View>

      {/* Habit List */}
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits yet. Create one!</Text>
        }
      />

      {/* Create Habit Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateHabit')}
      >
        <Text style={styles.createButtonText}>+ Create Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  icon: {
    fontSize: 24,
  },
  streakView: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 16,
    color: '#666',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  habitCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitStreak: {
    fontSize: 16,
  },
  habitPriority: {
    color: '#666',
    marginBottom: 15,
  },
  miniCalendar: {
    marginTop: 10,
    marginBottom: 15,
  },
  calendarText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  calendarDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  incompleteDot: {
    backgroundColor: '#E0E0E0',
  },
  completeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  completeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  completeButtonTextActive: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    margin: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});