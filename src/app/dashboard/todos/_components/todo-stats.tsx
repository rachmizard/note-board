import { TodoStatusEnum } from "@/server/database/drizzle/todo.schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";
import React, { useMemo, useRef } from "react";
import { useTodos } from "../../../../shared/hooks/todo/use-todos";
import { calculateCompletionRate } from "../_utils/todo.utils";

// Remove the empty interface since we don't need props anymore
export const TodoStats: React.FC = () => {
  // Use the useTodos hook to fetch todos
  const todosQuery = useTodos({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Convert server todos to frontend Todo format
  const todos = useMemo(() => {
    if (!todosQuery.data?.data) return [];

    // Map server todo format to frontend Todo format
    return todosQuery.data.data;
  }, [todosQuery.data]);

  const completionRate = calculateCompletionRate(todos);
  const progressRef = useRef<HTMLDivElement>(null);
  const completedCount = todos.filter(
    (todo) => todo.status === TodoStatusEnum.COMPLETED
  ).length;
  const inProgressCount = todos.filter(
    (todo) => todo.status === TodoStatusEnum.IN_PROGRESS
  ).length;
  const backlogCount = todos.filter(
    (todo) => todo.status === TodoStatusEnum.BACKLOG
  ).length;
  const archivedCount = todos.filter(
    (todo) => todo.status === TodoStatusEnum.ARCHIVED
  ).length;

  // Show loading state while fetching data
  if (todosQuery.isLoading) {
    return (
      <div className="mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Todo Statistics</h3>
          <Skeleton className="h-2.5 w-full mb-3" />
          <div className="grid grid-cols-4 gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium ">
          Todo Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Completion Rate</span>
            <span className="text-sm font-medium">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <Progress ref={progressRef} value={completionRate} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded">
            <p className="text-lg font-medium">{inProgressCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              In Progress
            </p>
          </div>
          <div className="p-3 rounded">
            <p className="text-lg font-medium">{completedCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Completed
            </p>
          </div>
          <div className="p-3 rounded">
            <p className="text-lg font-medium">{backlogCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Backlog</p>
          </div>
          <div className="p-3 rounded">
            <p className="text-lg font-medium">{archivedCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Archived</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
