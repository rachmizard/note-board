import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Todo } from "@/types/todo";
import { useTodos } from "../_queries/use-todos";
import { useMemo } from "react";
import { TodoStatusEnum } from "@/server/database/drizzle/todo.schema";
import { mapTodoStatusFromServer } from "../utils/todo.utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export const TodoCompletionHistory = () => {
  // Use the same hook as in TodoList
  const todos = useTodos({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Convert server todos to frontend Todo format
  const convertedTodos = useMemo(() => {
    if (!todos.data?.data) return [];

    // Map server todo format to frontend Todo format
    return todos.data.data.map((serverTodo) => ({
      id: String(serverTodo.id),
      title: serverTodo.title,
      dueDate: serverTodo.dueDate || undefined,
      priority: serverTodo.priority.toLowerCase() as Todo["priority"],
      status: mapTodoStatusFromServer(serverTodo.status),
      createdAt: serverTodo.createdAt,
      completedAt:
        serverTodo.status === TodoStatusEnum.COMPLETED
          ? serverTodo.updatedAt
          : undefined,
      tags: serverTodo.tags || undefined,
    }));
  }, [todos.data]);

  // Get completion history
  const completionHistory = useMemo(() => {
    return convertedTodos
      .filter((todo) => todo.status === "completed" && todo.completedAt)
      .sort((a, b) => {
        const dateA = a.completedAt || new Date();
        const dateB = b.completedAt || new Date();
        return dateB.getTime() - dateA.getTime();
      });
  }, [convertedTodos]);

  if (completionHistory.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium ">
          Completion History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {completionHistory.map((todo) => (
            <div
              key={`history-${todo.id}`}
              className="text-xs sm:text-sm border-b pb-2 dark:border-gray-700"
            >
              <p className="font-medium">{todo.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Completed:{" "}
                {todo.completedAt?.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
