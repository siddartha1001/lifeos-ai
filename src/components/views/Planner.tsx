import { useState } from 'react';
import { CalendarClock, Sparkles, Clock, AlertCircle, Info, RefreshCw } from 'lucide-react';
import type { ScheduleBlock } from '@/types';
import { generateDemoSchedule } from '@/utils/planner';

interface PlannerProps {
  schedule: ScheduleBlock[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;
}

const CATEGORY_STYLES: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  Study: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-300', icon: '📚' },
  Break: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-300', icon: '☕' },
  Personal: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-300', icon: '🌿' },
  Review: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-300', icon: '📝' },
};

const DEFAULT_GOALS = `Review Biology chapter 5
Practice Math problems
Read 20 pages of History
Work on coding project`;

export function Planner({ schedule, setSchedule }: PlannerProps) {
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [hours, setHours] = useState('6');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    const parsedHours = parseFloat(hours);
    if (!goals.trim()) {
      setError('Please enter at least one goal for the day.');
      return;
    }
    if (isNaN(parsedHours) || parsedHours <= 0 || parsedHours > 16) {
      setError('Available hours must be between 0.5 and 16.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate AI processing delay for demo
    setTimeout(() => {
      const result = generateDemoSchedule({ goals, availableHours: parsedHours });
      setSchedule(result);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          AI Daily Planner
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Enter your goals and available time to generate a structured schedule.
        </p>
      </div>

      {/* Demo mode banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200/90">
          <span className="font-semibold">Demo Mode:</span> The schedule is generated using built-in logic, not a real AI API.
          Responses are simulated to show how the feature will work once an AI API key is configured.
        </div>
      </div>

      {/* Input form */}
      <div className="glass-card p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Today's Goals</label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Enter one goal per line..."
            className="input-field resize-none"
            rows={5}
          />
          <p className="text-xs text-gray-500 mt-1.5">One goal per line. Up to 8 goals will be scheduled.</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Available Hours</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0.5"
            max="16"
            step="0.5"
            className="input-field max-w-32"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Schedule
            </>
          )}
        </button>
      </div>

      {/* Generated schedule */}
      {schedule.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CalendarClock size={18} className="text-purple-400" />
              Your Daily Schedule
            </h3>
            <span className="text-xs text-gray-500">
              {schedule.length} blocks · Demo Mode
            </span>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[88px] top-0 bottom-0 w-px bg-white/10" />

            <div className="space-y-3">
              {schedule.map((block, i) => {
                const style = CATEGORY_STYLES[block.category] || CATEGORY_STYLES.Study;
                return (
                  <div
                    key={i}
                    className="relative flex items-start gap-4 animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Time */}
                    <div className="w-20 pt-3 text-right shrink-0">
                      <div className="text-xs font-mono text-gray-400">{block.time}</div>
                      <div className="text-[10px] text-gray-600">{block.duration}min</div>
                    </div>

                    {/* Dot */}
                    <div className={`relative z-10 mt-3.5 w-3 h-3 rounded-full border-2 ${style.border} ${style.bg} shrink-0`} />

                    {/* Card */}
                    <div className={`flex-1 glass-card-hover p-4 border-l-2 ${style.border}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{style.icon}</span>
                        <span className="text-sm text-white font-medium flex-1">{block.activity}</span>
                        <span className={`badge ${style.bg} ${style.text} ${style.border} border`}>
                          {block.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(
              schedule.reduce<Record<string, number>>((acc, b) => {
                acc[b.category] = (acc[b.category] || 0) + b.duration;
                return acc;
              }, {})
            ).map(([cat, mins]) => {
              const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.Study;
              return (
                <div key={cat} className={`glass-card p-3 text-center ${style.border} border`}>
                  <div className={`text-lg font-bold ${style.text}`}>
                    {Math.floor(mins / 60)}h {mins % 60}m
                  </div>
                  <div className="text-xs text-gray-400">{cat}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
