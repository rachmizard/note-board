"use client";

import { parseAsString, useQueryState } from "nuqs";

import { AnimatedList } from "@/components/magicui/animated-list";
import {
  Todo,
  TodoPriorityEnum,
  TodoStatusEnum,
  TodoTag,
} from "@/server/database/drizzle/todo.schema";
import { Button } from "@/shared/components/ui/button";
import { ListFilter } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useDeleteTodo } from "../_mutations/use-delete-todo";
import { useUpdateTodo } from "../_mutations/use-update-todo";
import { useTodos } from "../_queries/use-todos";
import { mapTodoStatusFromServer } from "../utils/todo.utils";
import { AddQuickTodoForm } from "./add-quick-todo-form";
import { TodoCompletionHistory } from "./todo-completion-history";
import { TodoItem } from "./todo-item";
import { TodoStats } from "./todo-stats";

interface TodoComment {
  id: string;
  text: string;
  createdAt: Date;
}

interface TodoWithRelations extends Todo {
  comments?: TodoComment[];
  tags?: TodoTag[];
}

const useFilterQueryState = () => {
  return useQueryState("status", parseAsString.withDefault("all"));
};

export const TodoList = () => {
  const [filter, setFilter] = useFilterQueryState();

  // Use the real data source with useTodos hook
  const todos = useTodos({
    page: 1,
    limit: 100, // Fetch a reasonable number of todos
    sortBy: "createdAt",
    sortOrder: "desc",
    status: filter === "all" ? undefined : (filter as TodoStatusEnum),
  });

  const deleteTodo = useDeleteTodo();
  const updateTodo = useUpdateTodo();

  // Convert server todos to frontend Todo format
  const convertedTodos = useMemo(() => {
    if (!todos.data?.data) return [];

    // Map server todo format to frontend Todo format
    return todos.data.data.map((serverTodo) => ({
      id: serverTodo.id,
      title: serverTodo.title,
      dueDate: serverTodo.dueDate,
      description: serverTodo.description,
      priority: serverTodo.priority,
      status: serverTodo.status,
      createdAt: serverTodo.createdAt,
      updatedAt: serverTodo.updatedAt,
      completedAt: serverTodo.completedAt,
      tags: serverTodo.tags || [],
    }));
  }, [todos.data]);

  const handleUpdateTodo = useCallback(
    (id: number, updates: Partial<TodoWithRelations>) => {
      // Convert client types to server enum types before mutation
      const serverUpdates: {
        id: number;
        title?: string;
        dueDate?: Date;
        priority?: TodoPriorityEnum;
        status?: TodoStatusEnum;
        description?: string;
      } = { id: id };

      if (updates.title) serverUpdates.title = updates.title;
      if (updates.dueDate) serverUpdates.dueDate = updates.dueDate;
      if (updates.priority) serverUpdates.priority = updates.priority;
      if (updates.status) serverUpdates.status = updates.status;

      updateTodo.mutate(serverUpdates);
    },
    [updateTodo]
  );

  const handleDeleteTodo = useCallback(
    (id: number) => {
      deleteTodo.mutate({ id });
    },
    [deleteTodo]
  );

  // Keep existing filtering logic
  const filteredTodos = useMemo(() => {
    return convertedTodos.filter((todo) => {
      if (filter === "all") return true;
      return mapTodoStatusFromServer(todo.status) === filter;
    });
  }, [convertedTodos, filter]);

  return (
    <div className="w-full mx-auto px-0 sm:px-6 lg:max-w-8xl">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4 lg:gap-8">
        <div className="w-full lg:max-w-[60%]">
          {/* Task Input Area */}
          <div className="mb-4 sm:mb-6 border-b pb-4">
            <AddQuickTodoForm />
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
              variant={filter === "inprogress" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("inprogress")}
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
            <AnimatedList delay={200} className="gap-2">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </AnimatedList>
          ) : (
            <div className="text-center py-6 sm:py-8 border rounded-lg dark:border-gray-700">
              <ListFilter className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
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
          <TodoStats />

          <TodoCompletionHistory />
        </div>
      </div>
    </div>
  );
};
