import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Habit } from '../../types/types';
import { loadHabits, saveHabits } from '../../utils/storage';

export default function CreateHabitScreen({ navigation, route }: any) {
  const editingHabit = route.params?.habit as Habit | undefined;
  const isEditing = !!editingHabit;

  const [habitName, setHabitName] = useState(editingHabit?.name || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    editingHabit?.priority || 'medium'
  );
  const [time, setTime] = useState(editingHabit?.time || '');

  const priorityOptions: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

  const handleSave = async () => {
    if (!habitName.trim()) {
      alert('Please enter a habit name');
      return;
    }

    const habits = await loadHabits();

    if (isEditing) {
      // Update existing habit
      const updatedHabits = habits.map(h =>
        h.id === editingHabit.id
          ? { ...h, name: habitName, priority, time }
          : h
      );
      await saveHabits(updatedHabits);
    } else {
      // Create new habit
      const newHabit: Habit = {
        id: Date.now().toString(),
        userId: 'default-user',
        name: habitName,
        priority,
        time,
        reminderEnabled: true,
        createdAt: new Date(),
        streak: 0,
        completionDates: [],
      };
      await saveHabits([...habits, newHabit]);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Edit Habit' : 'Create New Habit'}
      </Text>

      <Text style={styles.label}>Habit Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Drink Water, Exercise, Read"
        value={habitName}
        onChangeText={setHabitName}
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityContainer}>
        {priorityOptions.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityButton,
              priority === p && styles.priorityButtonActive,
            ]}
            onPress={() => setPriority(p)}
          >
            <Text
              style={[
                styles.priorityText,
                priority === p && styles.priorityTextActive,
              ]}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Time (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 08:00"
        value={time}
        onChangeText={setTime}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {isEditing ? 'Save Changes' : 'Create Habit'}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityText: {
    color: '#666',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});