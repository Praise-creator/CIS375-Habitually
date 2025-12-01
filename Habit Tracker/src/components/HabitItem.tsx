import { Check, X } from 'lucide-react';
import type { Habit } from '../App';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, onToggle, onDelete }: HabitItemProps) {
  const today = new Date().toDateString();
  const isCompletedToday = habit.completedDates.includes(today);
  
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

  const streak = getStreak();

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors group">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(habit.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompletedToday
              ? 'bg-neutral-900 border-neutral-900'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          {isCompletedToday && <Check className="w-4 h-4 text-white" />}
        </button>
        
        <div className="flex-1">
          <div className={`${isCompletedToday ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
            {habit.name}
          </div>
          {streak > 0 && (
            <div className="text-neutral-400 text-sm mt-1">
              {streak} day{streak !== 1 ? 's' : ''} streak
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(habit.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
