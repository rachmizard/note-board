import { trpc } from "@/server/trpc";
import {
  Todo,
  TodoSubTask,
  TodoWithRelations,
} from "@/server/database/drizzle/todo.schema";

// Format after our update to getTodos
interface TodoWithSubTaskCounts extends Omit<Todo, "subTasks"> {
  subTasks: {
    data: TodoSubTask[];
    total: number;
    completed: number;
  };
}

/**
 * Get subtask counts for a todo
 * @deprecated Use the subTasks field from the todo object directly
 */
export const useTodoSubTaskCount = (todoId: number, enabled = true) => {
  const query = trpc.todo.getSubTasks.useQuery(
    {
      todoId,
      page: 1,
      limit: 1, // We only need the count, not the actual items
    },
    {
      enabled,
      select: (data) => ({
        total: data.total,
        completed: data.data.filter((task) => task.completed).length,
      }),
    }
  );

  return {
    ...query,
    count: query.data?.total || 0,
    completedCount: query.data?.completed || 0,
  };
};

/**
 * Extract subtask counts from a todo object
 * This works with both the old and new subtask formats
 */
export const getSubTaskCount = (
  todo: TodoWithRelations | TodoWithSubTaskCounts | undefined
) => {
  if (!todo) {
    return {
      count: 0,
      completedCount: 0,
    };
  }

  // If subTasks is missing or null
  if (!todo.subTasks) {
    return {
      count: 0,
      completedCount: 0,
    };
  }

  // Handle new format (subTasks as an object with total and completed)
  if ("total" in todo.subTasks) {
    return {
      count: todo.subTasks.total || 0,
      completedCount: todo.subTasks.completed || 0,
    };
  }

  // Handle old format (subTasks as an array)
  if (Array.isArray(todo.subTasks)) {
    return {
      count: todo.subTasks.length,
      completedCount: todo.subTasks.filter(
        (task: TodoSubTask) => task.completed
      ).length,
    };
  }

  return {
    count: 0,
    completedCount: 0,
  };
};
