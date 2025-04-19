import {
  Todo,
  TodoPriorityEnum,
  TodoStatusEnum,
} from "@/server/database/drizzle/todo.schema";

// Helper function to map server todo status to frontend todo status
export const mapTodoStatusFromServer = (status: TodoStatusEnum): string => {
  switch (status) {
    case TodoStatusEnum.IN_PROGRESS:
      return "inprogress";
    case TodoStatusEnum.COMPLETED:
      return "completed";
    case TodoStatusEnum.BACKLOG:
      return "backlog";
    case TodoStatusEnum.ARCHIVED:
      return "archived";
    default:
      return "backlog";
  }
};

export const calculateCompletionRate = (todos: Todo[]): number => {
  if (todos.length === 0) return 0;

  // Only count non-archived todos toward completion rate
  const activeTodos = todos.filter(
    (todo) => todo.status !== TodoStatusEnum.ARCHIVED
  );
  if (activeTodos.length === 0) return 0;

  const completedCount = activeTodos.filter(
    (todo) => todo.status === TodoStatusEnum.COMPLETED
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

export const getPriorityColor = (priority: TodoPriorityEnum): string => {
  switch (priority) {
    case TodoPriorityEnum.LOW:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300";
    case TodoPriorityEnum.MEDIUM:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-300";
    case TodoPriorityEnum.HIGH:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 border-orange-300";
    case TodoPriorityEnum.CRITICAL:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-300";
    default:
      return "";
  }
};

export const getPriorityIconColor = (priority: TodoPriorityEnum): string => {
  switch (priority) {
    case TodoPriorityEnum.LOW:
      return "text-green-500";
    case TodoPriorityEnum.MEDIUM:
      return "text-yellow-500";
    case TodoPriorityEnum.HIGH:
      return "text-orange-500";
    case TodoPriorityEnum.CRITICAL:
      return "text-red-500";
    default:
      return "";
  }
};

export const getStatusColor = (status: TodoStatusEnum): string => {
  switch (status) {
    case TodoStatusEnum.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 border-blue-300";
    case TodoStatusEnum.COMPLETED:
      return "bg-green-100 text-green-800 border-green-300";
    case TodoStatusEnum.BACKLOG:
      return "bg-gray-100 text-gray-800 border-gray-300";
    case TodoStatusEnum.ARCHIVED:
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "";
  }
};
