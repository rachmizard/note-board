import { TodoBlock, PomodoroBlock } from "../types";

export const mockTodos: TodoBlock[] = [
  {
    id: "todo_001",
    type: "todo",
    title: "Finish Report",
    created_at: "2025-04-04T09:00:00Z",
    updated_at: "2025-04-04T09:00:00Z",
    status: "pending",
    properties: {
      due_date: "2025-04-04T09:00:00Z",
      priority: "high",
    },
    metadata: { user_id: "clerk_user_123" },
  },
  {
    id: "todo_002",
    type: "todo",
    title: "Review Code PR",
    created_at: "2025-04-04T13:00:00Z",
    updated_at: "2025-04-04T13:00:00Z",
    status: "pending",
    properties: {
      due_date: "2025-04-04T13:00:00Z",
      priority: "medium",
    },
    metadata: { user_id: "clerk_user_123" },
  },
  {
    id: "todo_003",
    type: "todo",
    title: "Weekly Team Meeting",
    created_at: "2025-04-05T10:00:00Z",
    updated_at: "2025-04-05T10:00:00Z",
    status: "pending",
    properties: {
      due_date: "2025-04-05T10:00:00Z",
      priority: "medium",
    },
    metadata: { user_id: "clerk_user_123" },
  },
];

export const mockPomodoros: PomodoroBlock[] = [
  {
    id: "pomo_001",
    type: "pomodoro",
    title: "Work on Report",
    created_at: "2025-04-04T09:00:00Z",
    updated_at: "2025-04-04T09:25:00Z",
    status: "completed",
    properties: {
      duration: 25,
      unit: "minutes",
    },
    metadata: { user_id: "clerk_user_123" },
  },
  {
    id: "pomo_002",
    type: "pomodoro",
    title: "Debug API Issue",
    created_at: "2025-04-04T14:00:00Z",
    updated_at: "2025-04-04T14:25:00Z",
    status: "completed",
    properties: {
      duration: 25,
      unit: "minutes",
    },
    metadata: { user_id: "clerk_user_123" },
  },
  {
    id: "pomo_003",
    type: "pomodoro",
    title: "Prepare Meeting Notes",
    created_at: "2025-04-05T09:00:00Z",
    updated_at: "2025-04-05T09:25:00Z",
    status: "completed",
    properties: {
      duration: 25,
      unit: "minutes",
    },
    metadata: { user_id: "clerk_user_123" },
  },
];

