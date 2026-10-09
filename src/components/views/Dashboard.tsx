import { CheckCircle2, Circle, TrendingUp, Target, Flame, Zap, Calendar, Clock } from 'lucide-react';
import type { Task, Habit, ViewKey, ScheduleBlock } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatDate, percentage, getStreak, todayKey } from '@/utils/helpers';

interface DashboardProps {
  tasks: Task[];
  habits: Habit[];
  schedule: ScheduleBlock[];
  onNavigate: (view: ViewKey) => void;
}

export function Dashboard({ tasks, habits, schedule, onNavigate }: DashboardProps) {
  const today = new Date();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = percentage(completedTasks, totalTasks);

  const todayDateStr = todayKey();
  const completedHabitsToday = habits.filter((h) => h.completions[todayDateStr]).length;
  const totalHabits = habits.length;
  const habitProgress = percentage(completedHabitsToday, totalHabits);

  const bestStreak = habits.reduce((max, h) => Math.max(max, getStreak(h.completions)), 0);

  const upcomingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 5);

  const todaySchedule = schedule.slice(0, 4);

  const greeting = getGreeting();

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome header */}
      <div className="relative glass-card overflow-hidden p-8">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Calendar size={16} className="text-purple-400" />
            {formatDate(today)}
          </div>
          <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {greeting}, <span className="gradient-text">Student</span>
          </h2>
          <p className="text-gray-400">
            You have {totalTasks - completedTasks} task{totalTasks - completedTasks !== 1 ? 's' : ''} remaining today. Let's make it count.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tasks"
          value={totalTasks}
          icon={<Target size={20} />}
          gradient="from-purple-600 to-purple-500"
        />
        <StatCard
          label="Completed"
          value={completedTasks}
          icon={<CheckCircle2 size={20} />}
          gradient="from-emerald-600 to-emerald-500"
        />
        <StatCard
          label="Daily Progress"
          value={`${progress}%`}
          icon={<TrendingUp size={20} />}
          gradient="from-blue-600 to-blue-500"
        />
        <StatCard
          label="Best Streak"
          value={`${bestStreak}d`}
          icon={<Flame size={20} />}
          gradient="from-orange-600 to-orange-500"
        />
      </div>

      {/* Progress overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task progress */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Zap size={18} className="text-purple-400" />
              Today's Progress
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Task Completion</span>
                <span className="text-white font-medium">{completedTasks}/{totalTasks}</span>
              </div>
              <ProgressBar value={progress} gradient="from-purple-500 to-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Habits Today</span>
                <span className="text-white font-medium">{completedHabitsToday}/{totalHabits}</span>
              </div>
              <ProgressBar value={habitProgress} gradient="from-emerald-500 to-teal-500" />
            </div>
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              Priority Tasks
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all →
            </button>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500/50" />
              All caught up! No pending tasks.
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Circle size={16} className="text-gray-500 shrink-0" />
                  <span className="text-sm text-gray-200 flex-1 truncate">{task.title}</span>
                  <span className={`badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's schedule preview */}
      {todaySchedule.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Calendar size={18} className="text-purple-400" />
              Today's AI Schedule
            </h3>
            <button
              onClick={() => onNavigate('planner')}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              View full schedule →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {todaySchedule.map((block, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="text-xs font-mono text-purple-400 w-20 shrink-0">{block.time}</div>
                <div className="text-sm text-gray-200 truncate">{block.activity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function priorityRank(p: string): number {
  return p === 'high' ? 0 : p === 'medium' ? 1 : 2;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ label, value, icon, gradient }: StatCardProps) {
  return (
    <div className="glass-card-hover p-5 group">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
