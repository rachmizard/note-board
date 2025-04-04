import React from "react";
import { Todo } from "@/types/todo";
import { calculateCompletionRate } from "@/utils/todo-utils";
import { Card } from "@/shared/components/ui/card";

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const completionRate = calculateCompletionRate(todos);
  const completedCount = todos.filter(
    (todo) => todo.status === "completed"
  ).length;
  const activeCount = todos.filter((todo) => todo.status === "active").length;
  const pausedCount = todos.filter((todo) => todo.status === "paused").length;

  return (
    <div className="mb-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-3">Todo Statistics</h3>

        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className="text-sm font-medium">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-lg font-medium">{activeCount}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-lg font-medium">{completedCount}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-lg font-medium">{pausedCount}</p>
            <p className="text-xs text-gray-500">Paused</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
