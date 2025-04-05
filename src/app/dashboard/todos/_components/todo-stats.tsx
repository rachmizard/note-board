import React, { useEffect, useRef, useMemo } from "react";
import { Todo } from "@/types/todo";
import { calculateCompletionRate } from "@/utils/todo-utils";
import { Card } from "@/shared/components/ui/card";
import confetti from "canvas-confetti";
import { useTodos } from "../_queries/use-todos";
import { mapTodoStatusFromServer } from "../utils/todo.utils";
import { TodoStatusEnum } from "@/server/database/drizzle/todo.schema";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Progress } from "@/shared/components/ui/progress";

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
    return todosQuery.data.data.map((serverTodo) => ({
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
  }, [todosQuery.data]);

  const completionRate = calculateCompletionRate(todos);
  const progressRef = useRef<HTMLDivElement>(null);
  const prevCompletedCountRef = useRef<number>(0);
  const completedCount = todos.filter(
    (todo) => todo.status === "completed"
  ).length;
  const inProgressCount = todos.filter(
    (todo) => todo.status === "inprogress"
  ).length;
  const backlogCount = todos.filter((todo) => todo.status === "backlog").length;
  const archivedCount = todos.filter(
    (todo) => todo.status === "archived"
  ).length;

  const handleProgressConfetti = async () => {
    try {
      const rect = progressRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = rect.left + rect.width;
      const y = rect.top + rect.height;
      await confetti({
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      });
    } catch (error) {
      console.error("Confetti button error:", error);
    }
  };

  const handle100PercentConfetti = async () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    if (completionRate === 100) {
      handle100PercentConfetti();
    }
  }, [completionRate]);

  useEffect(() => {
    // Only trigger confetti if the completed count has increased
    if (completedCount > prevCompletedCountRef.current) {
      handleProgressConfetti();
    }

    // Update the previous count reference
    prevCompletedCountRef.current = completedCount;
  }, [completedCount]);

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
    <div className="mb-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-3">Todo Statistics</h3>

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
      </Card>
    </div>
  );
};
