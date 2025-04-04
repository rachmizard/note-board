"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import { Todo, TodoStatus } from "@/types/todo";
import { TodoItem } from "./todo-item";
import { mockTodos } from "@/utils/mock-data";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ListFilter } from "lucide-react";
import { TodoStats } from "./todo-stats";
import { Input } from "@/shared/components/ui/input";

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Initialize with mock data for development purposes
  useEffect(() => {
    setTodos(mockTodos);
    setLoading(false);
  }, []);

  const handleAddTodo = (
    newTodoData: Omit<Todo, "id" | "createdAt" | "status" | "completedAt">
  ) => {
    const newTodo: Todo = {
      ...newTodoData,
      id: `todo-${Date.now()}`,
      status: "backlog",
      createdAt: new Date(),
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const handleQuickAddTodo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskTitle.trim()) {
      handleAddTodo({
        title: newTaskTitle.trim(),
        priority: "medium", // Default priority
      });
      setNewTaskTitle("");
    }
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    return todo.status === filter;
  });

  const completionHistory = todos
    .filter((todo) => todo.status === "completed" && todo.completedAt)
    .sort((a, b) => {
      const dateA = a.completedAt || new Date();
      const dateB = b.completedAt || new Date();
      return dateB.getTime() - dateA.getTime();
    });

  if (loading) {
    return <div>Loading todos...</div>;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:max-w-6xl">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4 lg:gap-8">
        <div className="w-full lg:max-w-[60%]">
          {/* Task Input Area */}
          <div className="mb-4 sm:mb-6 border-b pb-4">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleQuickAddTodo}
              placeholder="Type a new task and press Enter to add"
              className="w-full"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-4 mb-4 sm:mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-full text-xs sm:text-sm"
            >
              All
            </Button>
            <Button
              variant={filter === "in-progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("in-progress")}
              className="rounded-full text-xs sm:text-sm"
            >
              In Progress
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
              className="rounded-full text-xs sm:text-sm"
            >
              Completed
            </Button>
            <Button
              variant={filter === "backlog" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("backlog")}
              className="rounded-full text-xs sm:text-sm"
            >
              Backlog
            </Button>
            <Button
              variant={filter === "archived" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("archived")}
              className="rounded-full text-xs sm:text-sm"
            >
              Archived
            </Button>
          </div>

          {/* Todo List */}
          {filteredTodos.length > 0 ? (
            <div>
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 border rounded-lg">
              <ListFilter className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm sm:text-base text-gray-500">
                No todos found for the selected filter
              </p>
              {filter !== "all" && (
                <Button
                  variant="link"
                  onClick={() => setFilter("all")}
                  className="mt-2 text-sm sm:text-base"
                >
                  Show all todos
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="w-full mt-6 lg:mt-0 lg:max-w-[40%]">
          <TodoStats todos={todos} />

          {/* Completion History section can be moved to a separate tab or section if needed */}
          {completionHistory.length > 0 && (
            <Card className="p-3 sm:p-4 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                Completion History
              </h3>
              <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                {completionHistory.map((todo) => (
                  <div
                    key={`history-${todo.id}`}
                    className="text-xs sm:text-sm border-b pb-2"
                  >
                    <p className="font-medium">{todo.title}</p>
                    <p className="text-xs text-gray-500">
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
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
