import { Calendar, Plus, Settings, TrendingUp } from 'lucide-react';
import type { Screen, Habit } from '../App';

interface HomePageProps {
  habits: Habit[];
  onNavigate: (screen: Screen) => void;
  onSelectHabit: (id: string) => void;
  onToggleHabit: (id: string) => void;
  theme: 'light' | 'dark';
}

export function HomePage({ habits, onNavigate, onSelectHabit, onToggleHabit, theme }: HomePageProps) {
  const today = new Date();
  const todayString = today.toDateString();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const getStreak = (habit: Habit) => {
    const sortedDates = [...habit.completedDates]
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const now = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateString = checkDate.toDateString();
      
      if (sortedDates.some(d => d.toDateString() === checkDateString)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const totalStreak = habits.reduce((sum, habit) => sum + getStreak(habit), 0);
  const completedToday = habits.filter(h => h.completedDates.includes(todayString)).length;

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      {/* Header */}
      <div className={`pt-16 pb-4 px-6 ${
        theme === 'dark' ? 'bg-neutral-800 border-b border-neutral-700' : 'bg-white border-b border-neutral-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Habits</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('calendar')}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'text-neutral-400 hover:bg-neutral-700' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'text-neutral-400 hover:bg-neutral-700' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Date */}
        <div className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>
          <p>{dayName}</p>
          <p>{dateString}</p>
        </div>
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        {habits.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <p>No habits yet</p>
            <p className="text-sm mt-2">Tap + to create your first habit</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const isCompletedToday = habit.completedDates.includes(todayString);
              const streak = getStreak(habit);

              return (
                <div
                  key={habit.id}
                  onClick={() => onSelectHabit(habit.id)}
                  className={`rounded-2xl p-4 border active:scale-95 transition-transform ${
                    theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleHabit(habit.id);
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                        isCompletedToday
                          ? `bg-${habit.color}-500 border-${habit.color}-500`
                          : theme === 'dark' ? 'border-neutral-600' : 'border-neutral-300'
                      }`}
                      style={{
                        backgroundColor: isCompletedToday ? habit.color : 'transparent',
                        borderColor: habit.color,
                      }}
                    >
                      {isCompletedToday && <span className="text-white text-sm">✓</span>}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{habit.icon}</span>
                        <span className={`${
                          isCompletedToday 
                            ? theme === 'dark' ? 'text-neutral-500 line-through' : 'text-neutral-400 line-through'
                            : theme === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {habit.name}
                        </span>
                      </div>
                      <div className={`flex items-center gap-3 text-sm ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}>
                        <span className="capitalize">{habit.timeRange}</span>
                        {streak > 0 && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {streak} days
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Streaks Summary */}
      <div className="absolute bottom-20 left-0 right-0 p-6">
        <div className={`rounded-2xl p-4 ${
          theme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-neutral-900 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                Today's Progress
              </p>
              <p className="text-2xl mt-1">{completedToday} / {habits.length}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                Total Streaks
              </p>
              <p className="text-2xl mt-1">{totalStreak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => onNavigate('habit-creation')}
        className={`absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform ${
          theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}