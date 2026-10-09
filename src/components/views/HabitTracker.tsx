import { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  Flame,
  Repeat,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import type { Habit } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { uid, todayKey, dateKey, getStreak, getLast7Days, percentage } from '@/utils/helpers';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HABIT_ICONS = ['📚', '💧', '🏃', '🧘', '💤', '🥗', '✍️', '🎯', '🎸', '💻'];
const HABIT_COLORS = [
  'from-purple-500 to-purple-600',
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-cyan-500 to-cyan-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
];

const EMPTY_FORM = { name: '', icon: HABIT_ICONS[0], color: HABIT_COLORS[0] };

export function HabitTracker({ habits, setHabits }: HabitTrackerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const today = todayKey();
  const last7 = getLast7Days();

  const handleAdd = () => {
    if (!form.name.trim()) {
      setError('Habit name is required');
      return;
    }
    if (form.name.trim().length > 50) {
      setError('Habit name must be under 50 characters');
      return;
    }

    const newHabit: Habit = {
      id: uid(),
      name: form.name.trim(),
      icon: form.icon,
      color: form.color,
      createdAt: Date.now(),
      completions: {},
    };
    setHabits((prev) => [...prev, newHabit]);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(false);
  };

  const toggleToday = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const completions = { ...h.completions };
        if (completions[today]) {
          delete completions[today];
        } else {
          completions[today] = true;
        }
        return { ...h, completions };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const completedToday = habits.filter((h) => h.completions[today]).length;
  const overallProgress = percentage(completedToday, habits.length);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Habit Tracker
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {completedToday}/{habits.length} completed today · {overallProgress}% overall
          </p>
        </div>
        <button
          onClick={() => { setForm(EMPTY_FORM); setError(''); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus size={18} />
          Add Habit
        </button>
      </div>

      {/* Overall progress */}
      {habits.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={18} className="text-purple-400" />
            <span className="text-sm text-gray-300">Today's Habit Progress</span>
          </div>
          <ProgressBar value={overallProgress} gradient="from-purple-500 to-blue-500" height="h-3" />
        </div>
      )}

      {/* Habit list */}
      {habits.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Repeat size={48} className="mx-auto mb-4 text-purple-500/40" />
          <p className="text-gray-400 mb-1">No habits tracked yet</p>
          <p className="text-sm text-gray-500">Build consistency by adding your first habit.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => {
            const streak = getStreak(habit.completions);
            const doneToday = habit.completions[today];
            const last7Count = last7.filter((d) => habit.completions[d.key]).length;
            const weeklyPct = percentage(last7Count, 7);

            return (
              <div key={habit.id} className="glass-card-hover p-5 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${habit.color} flex items-center justify-center text-2xl shrink-0`}>
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{habit.name}</h3>
                    <div className="flex items-center gap-4 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Flame size={14} className="text-orange-400" />
                        {streak} day streak
                      </span>
                      <span>{last7Count}/7 this week</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleToday(habit.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                      doneToday
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {doneToday ? '✓ Done' : 'Mark Done'}
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Weekly grid */}
                <div className="grid grid-cols-7 gap-2">
                  {last7.map((day) => {
                    const done = habit.completions[day.key];
                    const isToday = day.key === today;
                    return (
                      <button
                        key={day.key}
                        onClick={() => {
                          setHabits((prev) =>
                            prev.map((h) => {
                              if (h.id !== habit.id) return h;
                              const completions = { ...h.completions };
                              if (completions[day.key]) {
                                delete completions[day.key];
                              } else {
                                completions[day.key] = true;
                              }
                              return { ...h, completions };
                            })
                          );
                        }}
                        className={`flex flex-col items-center gap-1.5 py-2 rounded-lg transition-all hover:scale-105 ${
                          isToday ? 'ring-1 ring-purple-500/40' : ''
                        }`}
                      >
                        <span className="text-[10px] text-gray-500">{day.label}</span>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            done
                              ? `bg-gradient-to-br ${habit.color} text-white`
                              : 'bg-white/5 text-gray-600 border border-white/10'
                          }`}
                        >
                          {done && <Check size={14} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <ProgressBar value={weeklyPct} gradient={habit.color} height="h-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Habit"
      >
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Habit Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Drink 8 glasses of water"
              className="input-field"
              maxLength={50}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Icon</label>
            <div className="grid grid-cols-10 gap-1.5">
              {HABIT_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    form.icon === icon
                      ? 'bg-purple-600/30 ring-2 ring-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Color</label>
            <div className="grid grid-cols-8 gap-2">
              {HABIT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, color })}
                  className={`h-9 rounded-lg bg-gradient-to-br ${color} transition-all ${
                    form.color === color ? 'ring-2 ring-white/50 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button onClick={handleAdd} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Check size={18} />
              Add Habit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
