import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Screen, Habit } from '../App';

interface HabitCreationPageProps {
  onNavigate: (screen: Screen) => void;
  onSave: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
  theme: 'light' | 'dark';
}

const ICONS = ['🏃', '📚', '💧', '🧘', '💪', '🎨', '🎵', '✍️', '🌱', '🍎'];
const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
const TIME_RANGES = ['morning', 'afternoon', 'evening', 'anytime'] as const;

export function HabitCreationPage({ onNavigate, onSave, theme }: HabitCreationPageProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [timeRange, setTimeRange] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('anytime');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly' | 'interval'>('daily');
  const [weekDays, setWeekDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [monthDay, setMonthDay] = useState(1);
  const [intervalDays, setIntervalDays] = useState(2);

  const handleSave = () => {
    if (!name.trim()) return;

    const recurrence: Habit['recurrence'] = { type: recurrenceType };
    if (recurrenceType === 'weekly') recurrence.weekDays = weekDays;
    if (recurrenceType === 'monthly') recurrence.monthDay = monthDay;
    if (recurrenceType === 'interval') recurrence.intervalDays = intervalDays;

    onSave({
      name: name.trim(),
      icon,
      color,
      timeRange,
      reminder,
      reminderTime: reminder ? reminderTime : undefined,
      recurrence,
    });
  };

  const toggleWeekDay = (day: number) => {
    setWeekDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const weekDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
          <h1 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>New Habit</h1>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Name */}
        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Habit Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
              theme === 'dark'
                ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
            }`}
            placeholder="e.g. Morning run"
          />
        </div>

        {/* Icon */}
        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>Icon</label>
          <div className="flex gap-2 flex-wrap">
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
        </div>

        {/* Color */}
        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>Color</label>
          <div className="flex gap-2">
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

        {/* Time Range */}
        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Time of Day
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`py-3 rounded-xl capitalize ${
                  timeRange === range
                    ? theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                    : theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Reminder */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}>Reminder</label>
            <button
              onClick={() => setReminder(!reminder)}
              className={`w-12 h-7 rounded-full transition-colors ${
                reminder 
                  ? theme === 'dark' ? 'bg-white' : 'bg-neutral-900'
                  : theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  theme === 'dark' ? 'bg-neutral-900' : 'bg-white'
                } ${reminder ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          {reminder && (
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                  : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
              }`}
            />
          )}
        </div>

        {/* Recurrence */}
        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>Repeat</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(['daily', 'weekly', 'monthly', 'interval'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setRecurrenceType(type)}
                className={`py-3 rounded-xl capitalize ${
                  recurrenceType === type
                    ? theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                    : theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {recurrenceType === 'weekly' && (
            <div className="flex gap-2 justify-between">
              {weekDayNames.map((day, i) => (
                <button
                  key={i}
                  onClick={() => toggleWeekDay(i)}
                  className={`w-10 h-10 rounded-full ${
                    weekDays.includes(i)
                      ? theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                      : theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}

          {recurrenceType === 'monthly' && (
            <div>
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Day of month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={monthDay}
                onChange={(e) => setMonthDay(parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                    : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
                }`}
              />
            </div>
          )}

          {recurrenceType === 'interval' && (
            <div>
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Every X days
              </label>
              <input
                type="number"
                min="1"
                value={intervalDays}
                onChange={(e) => setIntervalDays(parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                    : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}