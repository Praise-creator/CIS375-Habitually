import { useState } from 'react';
import { ArrowLeft, Trash2, Check } from 'lucide-react';
import type { Screen, Habit } from '../App';

interface HabitDetailPageProps {
  habit: Habit;
  onNavigate: (screen: Screen) => void;
  onUpdate: (updates: Partial<Habit>) => void;
  onDelete: () => void;
  onToggleToday: () => void;
  theme: 'light' | 'dark';
}

const ICONS = ['🏃', '📚', '💧', '🧘', '💪', '🎨', '🎵', '✍️', '🌱', '🍎'];
const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export function HabitDetailPage({
  habit,
  onNavigate,
  onUpdate,
  onDelete,
  onToggleToday,
  theme,
}: HabitDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [icon, setIcon] = useState(habit.icon);
  const [color, setColor] = useState(habit.color);

  const today = new Date();
  const todayString = today.toDateString();
  const isCompletedToday = habit.completedDates.includes(todayString);

  const handleSave = () => {
    onUpdate({ name, icon, color });
    setIsEditing(false);
  };

  // Mini calendar - last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const getStreak = () => {
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

  return (
    <div className={`h-full flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`pt-16 pb-4 px-6 border-b sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'
      }`}>
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2">
            <ArrowLeft className={`w-6 h-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-900'}`} />
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
              }`}
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={theme === 'dark' ? 'px-4 py-2 text-white' : 'px-4 py-2 text-neutral-900'}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Icon & Name */}
        <div className="text-center">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap justify-center">
                {ICONS.map((i) => (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    className={`w-12 h-12 rounded-xl text-2xl ${
                      icon === i 
                        ? theme === 'dark' ? 'bg-white' : 'bg-neutral-900'
                        : theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-100'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-center focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                    : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
                }`}
              />
              <div className="flex gap-2 justify-center">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full ${
                      color === c ? 'ring-2 ring-offset-2' : ''
                    } ${theme === 'dark' ? 'ring-white ring-offset-neutral-900' : 'ring-neutral-900 ring-offset-white'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="text-6xl mb-4">{habit.icon}</div>
              <h1 className={`mb-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{habit.name}</h1>
              <p className={`capitalize ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {habit.timeRange}
              </p>
            </>
          )}
        </div>

        {/* Mark Done Today */}
        <button
          onClick={onToggleToday}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
            isCompletedToday
              ? theme === 'dark' ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
              : theme === 'dark' ? 'text-white' : 'text-white'
          }`}
          style={isCompletedToday ? {} : { backgroundColor: habit.color }}
        >
          {isCompletedToday ? (
            <>
              <Check className="w-5 h-5" />
              <span>Completed Today</span>
            </>
          ) : (
            <span>Mark as Done Today</span>
          )}
        </button>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-xl p-4 text-center ${
            theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Current Streak</p>
            <p className={`text-3xl mt-1 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{getStreak()}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>days</p>
          </div>
          <div className={`rounded-xl p-4 text-center ${
            theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Total Days</p>
            <p className={`text-3xl mt-1 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
              {habit.completedDates.length}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>completed</p>
          </div>
        </div>

        {/* Mini Calendar - Last 7 Days */}
        <div>
          <h3 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>This Week</h3>
          <div className="flex gap-2">
            {last7Days.map((date, i) => {
              const dateString = date.toDateString();
              const isCompleted = habit.completedDates.includes(dateString);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' });
              const dayNum = date.getDate();

              return (
                <div key={i} className="flex-1 text-center">
                  <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {dayName}
                  </p>
                  <div
                    className={`w-full aspect-square rounded-xl flex items-center justify-center ${
                      isCompleted ? 'text-white' : theme === 'dark' 
                        ? 'bg-neutral-800 text-neutral-400' 
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                    style={isCompleted ? { backgroundColor: habit.color } : {}}
                  >
                    {isCompleted ? '✓' : dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recurrence Info */}
        <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
          <h3 className={`mb-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Schedule</h3>
          <p className={`capitalize ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {habit.recurrence.type}
            {habit.recurrence.type === 'interval' && ` (every ${habit.recurrence.intervalDays} days)`}
          </p>
          {habit.reminder && habit.reminderTime && (
            <p className={`mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Reminder at {habit.reminderTime}
            </p>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => {
            if (confirm('Delete this habit?')) {
              onDelete();
            }
          }}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 ${
            theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete Habit</span>
        </button>
      </div>
    </div>
  );
}