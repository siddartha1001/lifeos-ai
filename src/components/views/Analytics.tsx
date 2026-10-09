import { BarChart3, TrendingUp, CheckCircle2, Circle, Target, Flame, Award } from 'lucide-react';
import type { Task, Habit, Priority } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { percentage, getStreak, getLast7Days, todayKey } from '@/utils/helpers';

interface AnalyticsProps {
  tasks: Task[];
  habits: Habit[];
}

export function Analytics({ tasks, habits }: AnalyticsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const completionRate = percentage(completed, total);

  // Priority breakdown
  const priorityBreakdown = (['high', 'medium', 'low'] as Priority[]).map((p) => ({
    priority: p,
    total: tasks.filter((t) => t.priority === p).length,
    completed: tasks.filter((t) => t.priority === p && t.completed).length,
  }));

  // Last 7 days task completion
  const last7 = getLast7Days();
  const dailyCompletions = last7.map((day) => {
    const count = tasks.filter((t) => {
      if (!t.completed || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt).toISOString().split('T')[0];
      return completedDate === day.key;
    }).length;
    return { ...day, count };
  });

  const maxDaily = Math.max(1, ...dailyCompletions.map((d) => d.count));

  // Habit analytics
  const habitStats = habits.map((h) => {
    const streak = getStreak(h.completions);
    const last7Count = last7.filter((d) => h.completions[d.key]).length;
    return { ...h, streak, weeklyCount: last7Count, weeklyPct: percentage(last7Count, 7) };
  });

  const bestStreak = habits.reduce((max, h) => Math.max(max, getStreak(h.completions)), 0);
  const todayHabitCount = habits.filter((h) => h.completions[todayKey()]).length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Analytics
        </h2>
        <p className="text-sm text-gray-400 mt-1">Track your progress and productivity trends</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp size={18} />} color="text-purple-400" />
        <StatCard label="Total Tasks" value={total} icon={<Target size={18} />} color="text-blue-400" />
        <StatCard label="Active Tasks" value={active} icon={<Circle size={18} />} color="text-amber-400" />
        <StatCard label="Best Streak" value={`${bestStreak}d`} icon={<Flame size={18} />} color="text-orange-400" />
      </div>

      {/* Task completion chart */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-400" />
          Task Completion — Last 7 Days
        </h3>
        <p className="text-xs text-gray-500 mb-6">Tasks completed per day</p>

        <div className="flex items-end justify-between gap-2 h-48">
          {dailyCompletions.map((day) => (
            <div key={day.key} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Bar */}
              <div className="w-full flex-1 flex items-end relative">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-blue-500 transition-all duration-700 group-hover:from-purple-500 group-hover:to-blue-400 relative"
                  style={{ height: `${(day.count / maxDaily) * 100}%`, minHeight: day.count > 0 ? '8px' : '2px' }}
                >
                  {day.count > 0 && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.count}
                    </span>
                  )}
                </div>
              </div>
              {/* Label */}
              <span className="text-xs text-gray-400">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority breakdown & Habit analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Priority breakdown */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Award size={18} className="text-blue-400" />
            Task Priority Breakdown
          </h3>
          <div className="space-y-5">
            {priorityBreakdown.map((p) => (
              <div key={p.priority}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full priority-dot-${p.priority}`} />
                    <span className="text-gray-300 capitalize">{p.priority} Priority</span>
                  </span>
                  <span className="text-gray-400">
                    {p.completed}/{p.total} completed
                  </span>
                </div>
                <ProgressBar
                  value={percentage(p.completed, p.total)}
                  gradient={
                    p.priority === 'high'
                      ? 'from-red-500 to-orange-500'
                      : p.priority === 'medium'
                      ? 'from-amber-500 to-yellow-500'
                      : 'from-emerald-500 to-teal-500'
                  }
                />
              </div>
            ))}
          </div>

          {/* Completion donut */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-6">
              <DonutChart completed={completed} total={total} />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                  <span className="text-gray-300">Completed: {completed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <span className="text-gray-300">Remaining: {active}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Habit analytics */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Flame size={18} className="text-orange-400" />
            Habit Performance
          </h3>
          {habitStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-gray-600" />
              Add habits to see analytics
            </div>
          ) : (
            <div className="space-y-4">
              {habitStats.map((h) => (
                <div key={h.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${h.color} flex items-center justify-center text-lg shrink-0`}>
                    {h.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 truncate">{h.name}</span>
                      <span className="text-gray-500 text-xs">
                        {h.streak}d streak · {h.weeklyCount}/7
                      </span>
                    </div>
                    <ProgressBar value={h.weeklyPct} gradient={h.color} height="h-1.5" />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                <span className="text-gray-400">Completed Today</span>
                <span className="text-white font-medium">
                  {todayHabitCount}/{habits.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="glass-card-hover p-5">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function DonutChart({ completed, total }: { completed: number; total: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : completed / total;
  const offset = circumference - pct * circumference;

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <defs>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#donutGrad)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}
