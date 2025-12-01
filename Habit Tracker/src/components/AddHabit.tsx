import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddHabitProps {
  onAdd: (name: string) => void;
}

export function AddHabit({ onAdd }: AddHabitProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a new habit..."
          className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
