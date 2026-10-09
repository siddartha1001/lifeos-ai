import { useState } from 'react';
import { Menu } from 'lucide-react';
import type { ViewKey, Task, Habit, ChatMessage, ScheduleBlock } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/views/Dashboard';
import { TaskManager } from '@/components/views/TaskManager';
import { Planner } from '@/components/views/Planner';
import { HabitTracker } from '@/components/views/HabitTracker';
import { Assistant } from '@/components/views/Assistant';
import { Analytics } from '@/components/views/Analytics';

const VIEW_TITLES: Record<ViewKey, string> = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  planner: 'AI Planner',
  habits: 'Habits',
  assistant: 'AI Assistant',
  analytics: 'Analytics',
};

export default function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [tasks, setTasks] = useLocalStorage<Task[]>('lifeos_tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('lifeos_habits', []);
  const [schedule, setSchedule] = useLocalStorage<ScheduleBlock[]>('lifeos_schedule', []);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('lifeos_chat', []);

  const handleNavigate = (v: ViewKey) => {
    setView(v);
    setMobileNavOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a12]">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <Sidebar
        current={view}
        onNavigate={handleNavigate}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 min-w-0 relative">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <Menu size={20} />
            </button>
            <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              LIFEOS AI
            </span>
          </div>
          <span className="text-xs text-gray-500">{VIEW_TITLES[view]}</span>
        </header>

        {/* Main content */}
        <main className="relative p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard tasks={tasks} habits={habits} schedule={schedule} onNavigate={handleNavigate} />
          )}
          {view === 'tasks' && <TaskManager tasks={tasks} setTasks={setTasks} />}
          {view === 'planner' && <Planner schedule={schedule} setSchedule={setSchedule} />}
          {view === 'habits' && <HabitTracker habits={habits} setHabits={setHabits} />}
          {view === 'assistant' && <Assistant messages={messages} setMessages={setMessages} />}
          {view === 'analytics' && <Analytics tasks={tasks} habits={habits} />}
        </main>
      </div>
    </div>
  );
}
