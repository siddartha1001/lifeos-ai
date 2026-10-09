import type { ScheduleBlock } from '@/types';

interface PlannerInput {
  goals: string;
  availableHours: number;
}

const CATEGORY_COLORS: Record<string, string> = {};

export function generateDemoSchedule(input: PlannerInput): ScheduleBlock[] {
  const { goals, availableHours } = input;

  const goalList = goals
    .split('\n')
    .map((g) => g.trim())
    .filter((g) => g.length > 0)
    .slice(0, 8);

  if (goalList.length === 0 || availableHours <= 0) {
    return [];
  }

  const blocks: ScheduleBlock[] = [];
  let currentTime = new Date();
  currentTime.setHours(8, 0, 0, 0);

  // Morning routine
  blocks.push({
    time: formatTime(currentTime),
    activity: 'Morning Routine & Breakfast',
    duration: 30,
    category: 'Personal',
  });
  advanceTime(currentTime, 30);

  // Distribute goals across available time
  const totalStudyMinutes = Math.min(availableHours * 60 - 90, goalList.length * 75);
  const perGoalMinutes = Math.max(30, Math.floor(totalStudyMinutes / goalList.length));
  const breakInterval = 2; // break every 2 study blocks

  for (let i = 0; i < goalList.length; i++) {
    if (currentTime.getHours() >= 22) break;

    blocks.push({
      time: formatTime(currentTime),
      activity: goalList[i],
      duration: perGoalMinutes,
      category: 'Study',
    });
    advanceTime(currentTime, perGoalMinutes);

    // Add a break every 2 study blocks
    if ((i + 1) % breakInterval === 0 && i < goalList.length - 1) {
      const breakMinutes = 15;
      blocks.push({
        time: formatTime(currentTime),
        activity: 'Break — Stretch & Hydrate',
        duration: breakMinutes,
        category: 'Break',
      });
      advanceTime(currentTime, breakMinutes);
    }
  }

  // Lunch around midday
  if (currentTime.getHours() < 13) {
    blocks.push({
      time: formatTime(currentTime),
      activity: 'Lunch Break',
      duration: 45,
      category: 'Personal',
    });
    advanceTime(currentTime, 45);
  }

  // Evening review
  if (currentTime.getHours() < 21) {
    blocks.push({
      time: formatTime(currentTime),
      activity: 'Review & Plan Tomorrow',
      duration: 20,
      category: 'Review',
    });
    advanceTime(currentTime, 20);
  }

  blocks.push({
    time: formatTime(currentTime),
    activity: 'Wind Down & Rest',
    duration: 30,
    category: 'Personal',
  });

  return blocks;
}

function advanceTime(date: Date, minutes: number): void {
  date.setTime(date.getTime() + minutes * 60000);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
