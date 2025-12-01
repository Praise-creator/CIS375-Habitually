import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Screen, Habit } from '../App';

interface CalendarPageProps {
  habits: Habit[];
  onNavigate: (screen: Screen) => void;
  onSelectHabit: (id: string) => void;
  theme: 'light' | 'dark';
}

export function CalendarPage({ habits, onNavigate, onSelectHabit, theme }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const filteredHabits = selectedHabitId
    ? habits.filter(h => h.id === selectedHabitId)
    : habits;

  const getCompletedCount = (day: number) => {
    const date = new Date(year, month, day).toDateString();
    return filteredHabits.filter(h => h.completedDates.includes(date)).length;
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getDateDetails = (date: Date) => {
    const dateString = date.toDateString();
    return filteredHabits.map(habit => ({
      habit,
      completed: habit.completedDates.includes(dateString),
    }));
  };

  return (
    <div className={`h-full flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`pt-16 pb-4 px-6 border-b sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2">
            <ArrowLeft className={`w-6 h-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-900'}`} />
          </button>
          <h1 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Calendar</h1>
          <div className="w-10" />
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          <button
            onClick={() => setSelectedHabitId(null)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedHabitId === null
                ? theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                : theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            All Habits
          </button>
          {habits.map(habit => (
            <button
              key={habit.id}
              onClick={() => setSelectedHabitId(habit.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 ${
                selectedHabitId === habit.id
                  ? 'text-white'
                  : theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
              }`}
              style={
                selectedHabitId === habit.id
                  ? { backgroundColor: habit.color }
                  : {}
              }
            >
              <span>{habit.icon}</span>
              <span>{habit.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2">
            <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-900'}`} />
          </button>
          <h2 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>{monthName}</h2>
          <button onClick={nextMonth} className="p-2">
            <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-900'}`} />
          </button>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className={`text-center text-sm ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={i} />;
            }

            const completedCount = getCompletedCount(day);
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative ${
                  isToday ? theme === 'dark' ? 'ring-2 ring-white' : 'ring-2 ring-neutral-900' : ''
                } ${
                  completedCount > 0 
                    ? theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                    : theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-50 text-neutral-700'
                }`}
              >
                <span className="text-sm">{day}</span>
                {completedCount > 0 && (
                  <span className="text-xs opacity-70">{completedCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Date Detail */}
        {selectedDate && (
          <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
            <h3 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <div className="space-y-2">
              {getDateDetails(selectedDate).map(({ habit, completed }) => (
                <button
                  key={habit.id}
                  onClick={() => onSelectHabit(habit.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-neutral-900' : 'bg-white'
                  }`}
                >
                  <span className="text-xl">{habit.icon}</span>
                  <span className={`flex-1 text-left ${
                    completed 
                      ? theme === 'dark' ? 'text-white' : 'text-neutral-900'
                      : theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    {habit.name}
                  </span>
                  {completed && (
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: habit.color }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}