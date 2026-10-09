import {
  LayoutDashboard,
  CheckSquare,
  CalendarClock,
  Repeat,
  Bot,
  BarChart3,
  Sparkles,
  X,
} from 'lucide-react';
import type { ViewKey } from '@/types';

interface SidebarProps {
  current: ViewKey;
  onNavigate: (view: ViewKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare },
  { key: 'planner', label: 'AI Planner', icon: CalendarClock },
  { key: 'habits', label: 'Habits', icon: Repeat },
  { key: 'assistant', label: 'AI Assistant', icon: Bot },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          h-screen w-72 shrink-0 flex flex-col
          bg-[#0d0d18] border-r border-white/10
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center glow-purple">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                LIFEOS<span className="gradient-text"> AI</span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-wide uppercase">
                One AI. One Dashboard.
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`nav-item w-full text-left ${active ? 'nav-item-active' : ''}`}
              >
                <Icon size={20} className={active ? 'text-purple-400' : ''} />
                <span className="text-sm font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-purple-400 font-semibold">Demo Mode</span>
              <br />
              AI features run on built-in logic. No real AI API is connected yet.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
