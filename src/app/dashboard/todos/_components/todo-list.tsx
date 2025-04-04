"use client";

import React, { useState, useEffect } from "react";
import { Todo, TodoStatus } from "@/types/todo";
import { TodoItem } from "./todo-item";
import { AddTodo } from "./add-todo";
import { TodoStats } from "./todo-stats";
import { mockTodos } from "@/utils/mock-data";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ListFilter } from "lucide-react";

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatus | "all">("all");
  const [loading, setLoading] = useState(true);

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
      status: "active",
      createdAt: new Date(),
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
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
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo List</h1>

        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant={filter === "paused" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("paused")}
          >
            Paused
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AddTodo onAdd={handleAddTodo} />

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
            <div className="text-center py-8 border rounded-lg">
              <ListFilter className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                No todos found for the selected filter
              </p>
              {filter !== "all" && (
                <Button
                  variant="link"
                  onClick={() => setFilter("all")}
                  className="mt-2"
                >
                  Show all todos
                </Button>
              )}
            </div>
          )}
        </div>

        <div>
          <TodoStats todos={todos} />

          {completionHistory.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-3">Completion History</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {completionHistory.map((todo) => (
                  <div
                    key={`history-${todo.id}`}
                    className="text-sm border-b pb-2"
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
