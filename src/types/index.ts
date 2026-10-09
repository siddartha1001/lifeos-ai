export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
  dueDate: string | null;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
  completions: Record<string, boolean>; // date string -> completed
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isDemo: boolean;
}

export interface ScheduleBlock {
  time: string;
  activity: string;
  duration: number;
  category: string;
}

export type ViewKey =
  | 'dashboard'
  | 'tasks'
  | 'planner'
  | 'habits'
  | 'assistant'
  | 'analytics';
