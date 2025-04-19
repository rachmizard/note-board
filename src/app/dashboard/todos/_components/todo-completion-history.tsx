import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TodoStatusEnum } from "@/server/database/drizzle/todo.schema";
import { useTodos } from "../_queries/use-todos";
import { useMemo } from "react";
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

    // Use the todos directly
    return todos.data.data;
  }, [todos.data]);

  // Get completion history
  const completionHistory = useMemo(() => {
    return convertedTodos
      .filter(
        (todo) => todo.status === TodoStatusEnum.COMPLETED && todo.completedAt
      )
      .sort((a, b) => {
        const dateA = a.completedAt || new Date();
        const dateB = b.completedAt || new Date();
        return dateB.getTime() - dateA.getTime();
      });
  }, [convertedTodos]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium ">
          Completion History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2 w-full">
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
