import { Todo, TodoPriority, TodoStatus } from "@/types/todo";

export const calculateCompletionRate = (todos: Todo[]): number => {
  if (todos.length === 0) return 0;

  // Only count non-archived todos toward completion rate
  const activeTodos = todos.filter((todo) => todo.status !== "archived");
  if (activeTodos.length === 0) return 0;

  const completedCount = activeTodos.filter(
    (todo) => todo.status === "completed"
  ).length;
  return (completedCount / activeTodos.length) * 100;
};

export const formatDate = (date?: Date): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isDueDateOverdue = (dueDate?: Date): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const getPriorityColor = (priority: TodoPriority): string => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
};

export const getStatusColor = (status: TodoStatus): string => {
  switch (status) {
    case "in-progress":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "backlog":
      return "bg-purple-100 text-purple-800";
    case "archived":
      return "bg-amber-100 text-amber-800";
    default:
      return "";
  }
};
