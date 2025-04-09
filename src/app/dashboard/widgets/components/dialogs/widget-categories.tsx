import {
  Activity,
  BarChart3,
  Clock,
  Timer,
  ListTodo,
  CheckCircle,
  Calendar,
  History,
  AlarmClock,
  CircleCheck,
  ListChecks,
} from "lucide-react";

interface WidgetItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: string;
  category: string;
}

interface WidgetCategory {
  title: string;
  icon: React.ReactNode;
  items: WidgetItem[];
}

export const WIDGET_CATEGORIES: WidgetCategory[] = [
  {
    title: "Pomodoros",
    icon: <Timer className="h-5 w-5 text-red-500" />,
    items: [
      {
        id: "pomodoro-activity",
        name: "Pomodoro Activity",
        icon: <Activity className="h-4 w-4" />,
        type: "activity-tracker",
        category: "Pomodoros",
      },
      {
        id: "pomodoros",
        name: "Pomodoros",
        icon: <Clock className="h-4 w-4" />,
        type: "timer",
        category: "Pomodoros",
      },
      {
        id: "weekly-pomodoros",
        name: "Weekly Pomodoros",
        icon: <BarChart3 className="h-4 w-4" />,
        type: "analytics",
        category: "Pomodoros",
      },
    ],
  },
  {
    title: "Timeline",
    icon: <History className="h-5 w-5 text-blue-500" />,
    items: [
      {
        id: "daily-timeline",
        name: "Daily Timeline",
        icon: <Calendar className="h-4 w-4" />,
        type: "calendar",
        category: "Timeline",
      },
      {
        id: "schedule",
        name: "Schedule",
        icon: <Calendar className="h-4 w-4" />,
        type: "planner",
        category: "Timeline",
      },
      {
        id: "time-tracking",
        name: "Time Tracking",
        icon: <AlarmClock className="h-4 w-4" />,
        type: "tracker",
        category: "Timeline",
      },
    ],
  },
  {
    title: "To-Do",
    icon: <ListTodo className="h-5 w-5 text-green-500" />,
    items: [
      {
        id: "task-list",
        name: "Task List",
        icon: <ListChecks className="h-4 w-4" />,
        type: "list",
        category: "To-Do",
      },
      {
        id: "completed-tasks",
        name: "Completed Tasks",
        icon: <CircleCheck className="h-4 w-4" />,
        type: "completed",
        category: "To-Do",
      },
      {
        id: "todo-progress",
        name: "Todo Progress",
        icon: <CheckCircle className="h-4 w-4" />,
        type: "progress",
        category: "To-Do",
      },
    ],
  },
];
