# LIFEOS AI

### One AI. One Dashboard. A Better You.

A premium, futuristic personal productivity dashboard designed to help students organize their daily tasks, study schedules, habits, priorities, and personal goals — all in one place.

Built for the AI Hackathon.

---

## Problem Statement

Students juggle classes, assignments, exams, habits, and personal goals across multiple tools and notebooks. There's rarely a single place to see everything at a glance, plan the day intelligently, and track progress over time. LIFEOS AI solves this by bringing task management, AI-assisted daily planning, habit tracking, an AI study assistant, and analytics into one unified, beautifully designed dashboard.

---

## Features

### 1. Dashboard
- Personalized welcome message with time-based greeting
- Today's date display
- Real-time stats: total tasks, completed tasks, daily progress percentage, best habit streak
- Task completion and habit progress bars
- Priority task preview
- AI schedule preview

### 2. Task Manager
- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- Set high, medium, and low priorities with visual indicators
- Filter by all, active, or completed
- Input validation (required title, max length enforcement)
- Auto-saves to localStorage

### 3. AI Daily Planner
- Input daily goals (one per line) and available hours
- Generates a structured timeline schedule with time blocks
- Categories: Study, Break, Personal, Review
- Time summary breakdown by category
- **Demo Mode**: Schedule generation uses built-in logic, clearly labeled as demo until a real AI API is configured

### 4. Habit Tracker
- Add habits with custom icons and gradient colors
- Mark habits as completed for today or any day in the past week
- 7-day visual completion grid
- Automatic streak counting
- Weekly progress bars per habit
- Overall daily habit progress

### 5. AI Assistant
- Clean chat interface with typing indicators
- Contextual responses for study tips, productivity advice, planning strategies, and motivation
- Suggestion prompts for quick start
- Chat history persists across sessions
- **Demo Mode**: All responses are generated from built-in logic, clearly labeled as demo — no real AI API is connected

### 6. Analytics
- Task completion bar chart (last 7 days)
- Priority breakdown with completion rates
- Circular donut chart for overall completion rate
- Per-habit performance with streaks and weekly stats
- Overview stat cards

### 7. Responsive Design
- Fully responsive from mobile to desktop
- Collapsible sidebar with hamburger menu on mobile
- Optimized layouts at all breakpoints

---

## Technology Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon system |
| **Vite** | Build tool and dev server |
| **localStorage** | Client-side data persistence |

---

## Project Structure

```
src/
├── App.tsx                    # Main app shell with navigation
├── main.tsx                   # React entry point
├── index.css                  # Global styles, theme, animations
├── types/
│   └── index.ts               # TypeScript type definitions
├── hooks/
│   └── useLocalStorage.ts     # Custom hook for localStorage persistence
├── utils/
│   ├── helpers.ts             # Date formatting, streaks, utilities
│   ├── planner.ts             # Demo schedule generation logic
│   └── assistant.ts           # Demo AI response generation logic
├── components/
│   ├── Sidebar.tsx            # Navigation sidebar
│   ├── ui/
│   │   ├── Modal.tsx          # Reusable modal component
│   │   └── ProgressBar.tsx    # Reusable progress bar component
│   └── views/
│       ├── Dashboard.tsx      # Dashboard view
│       ├── TaskManager.tsx    # Task management view
│       ├── Planner.tsx        # AI Daily Planner view
│       ├── HabitTracker.tsx   # Habit tracking view
│       ├── Assistant.tsx      # AI Assistant chat view
│       └── Analytics.tsx      # Analytics and charts view
```

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/siddartha1001/lifeos-ai.git
   cd lifeos-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build      # Creates optimized production build in dist/
npm run preview    # Previews the production build locally
```

### Type Checking

```bash
npm run typecheck
```

---

## Usage Guide

### Getting Started
1. Open the app — you'll land on the **Dashboard** with a welcome message and today's date.
2. Use the sidebar to navigate between sections.

### Managing Tasks
1. Go to **Tasks** and click **Add Task**.
2. Enter a title, optional description, and select a priority (high/medium/low).
3. Click the circle icon to mark a task complete.
4. Hover over a task to reveal edit and delete buttons.
5. Use the filter tabs to view all, active, or completed tasks.

### Planning Your Day
1. Go to **AI Planner**.
2. Enter your goals (one per line) and how many hours you have available.
3. Click **Generate Schedule** to see a structured timeline.
4. Note: This runs in **Demo Mode** — the schedule is generated by built-in logic, not a real AI API.

### Tracking Habits
1. Go to **Habits** and click **Add Habit**.
2. Name your habit, pick an icon and color, and save.
3. Click **Mark Done** or tap individual days in the 7-day grid.
4. Watch your streak grow over time.

### Chatting with the AI Assistant
1. Go to **AI Assistant**.
2. Click a suggestion prompt or type your own question.
3. Ask about study tips, productivity, planning, or motivation.
4. Note: Responses are **demo mode** — generated from built-in logic, not a real AI API.

### Viewing Analytics
1. Go to **Analytics** to see your productivity trends.
2. View the 7-day completion chart, priority breakdown, donut chart, and habit performance.

---

## Important Notes

- **AI features are in Demo Mode**: The AI Daily Planner and AI Assistant use built-in logic to simulate AI responses. They are clearly labeled with "Demo Mode" banners. No real AI API is connected. To connect a real AI API, replace the logic in `src/utils/planner.ts` and `src/utils/assistant.ts` with API calls.
- **Data persistence**: All data (tasks, habits, chat history, schedules) is stored in your browser's localStorage. Clearing browser data will reset the app.
- **No API keys are exposed**: The `.env` file is excluded from version control via `.gitignore`.

---

## Security

- `.env` files and secrets are excluded from version control (see `.gitignore`)
- No API keys, passwords, or tokens are committed to the repository
- User input is validated (required fields, max length, numeric range checks)

---

## License

This project is open source and available for educational purposes.

---

## Acknowledgments

Built with React, TypeScript, Tailwind CSS, and Lucide icons for the AI Hackathon.
