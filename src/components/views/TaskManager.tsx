import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  Circle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { Task, Priority } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { uid } from '@/utils/helpers';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const EMPTY_FORM = { title: '', description: '', priority: 'medium' as Priority };

export function TaskManager({ tasks, setTasks }: TaskManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, priority: task.priority });
    setError('');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (form.title.trim().length > 100) {
      setError('Task title must be under 100 characters');
      return;
    }

    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: form.title.trim(), description: form.description.trim(), priority: form.priority }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: uid(),
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        completed: false,
        createdAt: Date.now(),
        completedAt: null,
        dueDate: null,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setModalOpen(false);
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : null }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityRank(a.priority) - priorityRank(b.priority);
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Task Manager
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {activeCount} active · {completedCount} completed · {tasks.length} total
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task list */}
      {sortedTasks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-purple-500/40" />
          <p className="text-gray-400 mb-1">
            {filter === 'completed' ? 'No completed tasks yet' : 'No tasks here yet'}
          </p>
          <p className="text-sm text-gray-500">
            {filter === 'all' ? 'Click "Add Task" to create your first one.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`glass-card-hover p-4 group flex items-start gap-4 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleComplete(task.id)}
                className="mt-0.5 shrink-0 transition-transform hover:scale-110"
              >
                {task.completed ? (
                  <CheckCircle2 size={22} className="text-emerald-400" />
                ) : (
                  <Circle size={22} className="text-gray-500 hover:text-purple-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}
                  >
                    {task.title}
                  </span>
                  <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(task)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Task' : 'Add New Task'}
      >
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Read chapter 5 of Biology"
              className="input-field"
              maxLength={100}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add details..."
              className="input-field resize-none"
              rows={2}
              maxLength={300}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    form.priority === p
                      ? `priority-${p} ring-2 ring-offset-0`
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="capitalize flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full priority-dot-${p}`} />
                    {p}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Check size={18} />
              {editingId ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function priorityRank(p: Priority): number {
  return p === 'high' ? 0 : p === 'medium' ? 1 : 2;
}
