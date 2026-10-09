export function uid(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function dateKey(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

export function getStreak(completions: Record<string, boolean>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    if (completions[key]) {
      streak++;
    } else if (i === 0) {
      // today not done yet — don't break streak
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export function getLast7Days(): { key: string; label: string; date: Date }[] {
  const days: { key: string; label: string; date: Date }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      key: dateKey(d),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d,
    });
  }
  return days;
}
