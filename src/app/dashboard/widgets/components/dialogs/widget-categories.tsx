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

export const WIDGET_CATEGORIES = [
  {
    title: "Pomodoros",
    icon: <Timer className="h-5 w-5 text-red-500" />,
    items: [
      {
        id: "pomodoro-activity",
        name: "Pomodoro Activity",
        icon: <Activity className="h-4 w-4" />,
      },
      {
        id: "pomodoros",
        name: "Pomodoros",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        id: "weekly-pomodoros",
        name: "Weekly Pomodoros",
        icon: <BarChart3 className="h-4 w-4" />,
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
      },
      {
        id: "schedule",
        name: "Schedule",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: "time-tracking",
        name: "Time Tracking",
        icon: <AlarmClock className="h-4 w-4" />,
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
      },
      {
        id: "completed-tasks",
        name: "Completed Tasks",
        icon: <CircleCheck className="h-4 w-4" />,
      },
      {
        id: "todo-progress",
        name: "Todo Progress",
        icon: <CheckCircle className="h-4 w-4" />,
      },
    ],
  },
];
