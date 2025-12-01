import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import IntroScreen from './src/screens/auth/IntroScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import CreateHabitScreen from './src/screens/main/CreateHabitScreen';
import HabitDetailScreen from './src/screens/main/HabitDetailScreen';
import SettingsScreen from './src/screens/main/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}