const STUDY_TIPS = [
  'Try the Pomodoro technique: study for 25 minutes, then take a 5-minute break. It keeps your brain fresh and focused.',
  'Break large tasks into smaller chunks. Instead of "study biology," try "read chapter 5 and make flashcards."',
  'Review your notes within 24 hours of class — you retain up to 80% more information compared to reviewing a week later.',
  'Active recall is more effective than re-reading. Try closing your book and writing down everything you remember.',
  'Space out your study sessions. Studying 30 minutes a day for 4 days beats one 2-hour cram session.',
  'Teach a concept to someone else (or even to yourself out loud). If you can explain it simply, you understand it.',
  'Get 7-8 hours of sleep before exam day. Sleep is when your brain consolidates what you learned.',
  'Eliminate distractions: put your phone in another room or use a focus app. Even notifications on silent break concentration.',
  'Use the 2-minute rule: if a task takes less than 2 minutes, do it now instead of adding it to your list.',
  'Set a specific study space. Your brain associates that spot with focus, making it easier to get into the zone.',
  'Take a 10-minute walk when you feel stuck. Physical movement boosts creativity and problem-solving.',
  'Prioritize your hardest task first thing in the morning when your willpower and energy are highest.',
];

const PRODUCTIVITY_TIPS = [
  'Start your day by identifying your top 3 priorities. Everything else is secondary.',
  'Batch similar tasks together — do all your reading at once, all your emails at once.',
  'Set time limits on tasks. Parkinson\'s Law says work expands to fill the time you give it.',
  'Use the Eisenhower Matrix: separate urgent from important, and learn to ignore what\'s neither.',
  'Track your energy levels throughout the day for a week, then schedule hard tasks during peak hours.',
  'Take real breaks — step away from your desk, look at something far away, let your mind wander.',
  'End each day by planning tomorrow. You\'ll start the morning with momentum instead of indecision.',
  'Single-task. Multitasking is a myth — you\'re just switching fast and losing 40% of your efficiency.',
  'Celebrate small wins. Acknowledging progress releases dopamine and keeps you motivated.',
  'Declutter your workspace. A clean desk reduces visual stress and helps you focus.',
];

const MOTIVATION = [
  'You don\'t have to be perfect — you just have to keep going. Progress over perfection, every time.',
  'Every expert was once a beginner who refused to give up. Your current struggle is part of the process.',
  'The best time to start was yesterday. The second best time is right now. Let\'s get to it.',
  'Small steps every day add up to big results. You\'re closer than you think.',
  'You\'ve handled 100% of your bad days so far. That\'s a pretty impressive track record.',
  'Discipline is choosing what you want most over what you want now. You\'ve got this.',
];

const PLANNING_RESPONSES = [
  'Here\'s a planning approach: list your top 3 priorities, estimate time for each, then block them into your calendar around fixed commitments. Build in buffer time for unexpected tasks.',
  'For exam prep, work backwards from the exam date. Divide your material by the number of days you have, and schedule review sessions for each chunk. Leave the last 2 days for practice tests.',
  'When planning your week, protect your mornings for deep work and use afternoons for lighter tasks and admin. Reserve evenings for review and rest.',
  'A good weekly plan has 3 layers: must-do (non-negotiables), should-do (important but flexible), and could-do (nice-to-have). Focus on the first two.',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDemoResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('plan') || msg.includes('schedule') || msg.includes('organize')) {
    return pickRandom(PLANNING_RESPONSES);
  }

  if (msg.includes('study') || msg.includes('exam') || msg.includes('learn') || msg.includes('test')) {
    return pickRandom(STUDY_TIPS);
  }

  if (msg.includes('productiv') || msg.includes('focus') || msg.includes('efficient') || msg.includes('time')) {
    return pickRandom(PRODUCTIVITY_TIPS);
  }

  if (msg.includes('motivat') || msg.includes('stress') || msg.includes('tired') || msg.includes('give up') || msg.includes('hard') || msg.includes('overwhelm')) {
    return pickRandom(MOTIVATION);
  }

  if (msg.includes('habit')) {
    return 'To build a habit, start ridiculously small. Want to read more? Start with one page a day. The key is consistency, not intensity. Use the Habit Tracker to check off each day — seeing the streak grow is incredibly motivating!';
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return 'Hi there! I\'m your AI study assistant (running in demo mode). I can help with study tips, productivity advice, planning strategies, and motivation. What are you working on today?';
  }

  if (msg.includes('thank')) {
    return 'You\'re welcome! Remember, the best plan is the one you actually follow. Keep showing up!';
  }

  // Default: mix a study tip and a productivity tip
  const study = pickRandom(STUDY_TIPS);
  const prod = pickRandom(PRODUCTIVITY_TIPS);
  return `${study}\n\nAlso — ${prod.toLowerCase()}`;
}
