"use client";

import { AnimatedList } from "@/components/magicui/animated-list";
import {
  TodoPriorityEnum,
  TodoStatusEnum,
  TodoSubTask,
  TodoWithRelations,
} from "@/server/database/drizzle/todo.schema";
import { Button } from "@/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import confetti from "canvas-confetti";
import { cva } from "class-variance-authority";
import { ChevronDownIcon, ChevronUpIcon, ListFilter } from "lucide-react";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { priorityOptions } from "../_constants/todo.constant";
import { useFilterQueryState } from "../_hooks/use-filter-query-state";
import { usePriorityQueryState } from "../_hooks/use-priority-query-state";
import { useDeleteTodo } from "../_mutations/use-delete-todo";
import { useUpdateTodo } from "../_mutations/use-update-todo";
import { useTodos } from "../_queries/use-todos";
import {
  calculateCompletionRate,
  mapTodoStatusFromServer,
} from "../_utils/todo.utils";
import { AddQuickTodoForm } from "./add-quick-todo-form";
import { TodoCompletionHistory } from "./todo-completion-history";
import { TodoItem } from "./todo-item";
import { TodoItemSkeleton } from "./todo-item-skeleton";
import { TodoStats } from "./todo-stats";

export const TodoList = () => {
  const [filter, setFilter] = useFilterQueryState();
  const [priority] = usePriorityQueryState();

  // Use the real data source with useTodos hook
  const todos = useTodos({
    page: 1,
    limit: 100, // Fetch a reasonable number of todos
    sortBy: "createdAt",
    sortOrder: "desc",
    status: filter === "all" ? undefined : (filter as TodoStatusEnum),
    priority,
  });

  const deleteTodo = useDeleteTodo();
  const updateTodo = useUpdateTodo();

  // Convert server todos to frontend Todo format
  const convertedTodos = useMemo(() => {
    if (!todos.data?.data) return [];

    // Map server todo format to frontend Todo format, ensuring subTasks is always in the expected array format
    return todos.data.data.map((serverTodo) => {
      // Handle the case where subTasks might be in the new format with data, total, and completed properties
      let subTasksArray: TodoSubTask[] = [];

      if (serverTodo.subTasks) {
        // Check if subTasks has the data property (new format)
        const subTasksObj = serverTodo.subTasks as { data?: TodoSubTask[] };
        if (subTasksObj.data && Array.isArray(subTasksObj.data)) {
          subTasksArray = subTasksObj.data;
        }
        // Otherwise assume it's already an array (old format)
        else if (Array.isArray(serverTodo.subTasks)) {
          subTasksArray = serverTodo.subTasks;
        }
      }

      return {
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
        comments: serverTodo.comments || [],
        subTasks: subTasksArray,
        userId: serverTodo.userId,
        estimatedHours: serverTodo.estimatedHours,
        estimatedMinutes: serverTodo.estimatedMinutes,
        estimatedSeconds: serverTodo.estimatedSeconds,
        estimatedTotalInSeconds: serverTodo.estimatedTotalInSeconds,
      };
    });
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
        estimatedHours?: number;
        estimatedMinutes?: number;
        estimatedSeconds?: number;
      } = { id: id };

      if (updates.title) serverUpdates.title = updates.title;
      if (updates.dueDate) serverUpdates.dueDate = updates.dueDate;
      if (updates.priority) serverUpdates.priority = updates.priority;
      if (updates.status) serverUpdates.status = updates.status;
      if (updates.estimatedHours !== undefined)
        serverUpdates.estimatedHours = updates.estimatedHours ?? 0;
      if (updates.estimatedMinutes !== undefined)
        serverUpdates.estimatedMinutes = updates.estimatedMinutes ?? 0;
      if (updates.estimatedSeconds !== undefined)
        serverUpdates.estimatedSeconds = updates.estimatedSeconds ?? 0;

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
          <div className="mb-4 sm:mb-6">
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

          <TodoStatsWrapperMobile>
            <TodoCollapsibleStats>
              <TodoStats />
              <TodoCompletionHistory />
            </TodoCollapsibleStats>
          </TodoStatsWrapperMobile>

          <div className="my-4 flex justify-between items-start">
            <h1 className="text-xl font-bold">To Do</h1>

            <div>
              <FilterPriorityDropdown>
                {priorityOptions.map((option) => (
                  <FilterPriorityDropdownItem
                    key={option.value}
                    value={option.value as TodoPriorityEnum}
                  >
                    {option.label}
                  </FilterPriorityDropdownItem>
                ))}
              </FilterPriorityDropdown>
            </div>
          </div>

          {todos.isLoading && !filteredTodos.length && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <TodoItemSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Todo List */}
          {filteredTodos.length > 0 && !todos.isLoading && (
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
          )}

          {!filteredTodos.length && !todos.isLoading && (
            <div className="text-center py-6 sm:py-8 border rounded-lg">
              <ListFilter className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-foreground mb-2" />
              <p className="text-sm sm:text-base text-foreground">
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

        <TodoStatsWrapper>
          <TodoStats />
          <TodoCompletionHistory />
        </TodoStatsWrapper>

        <TodoConfettiEffect />
      </div>
    </div>
  );
};

const TodoStatsWrapper = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <div className="w-full mt-6 lg:mt-0 lg:max-w-[40%] hidden lg:block">
      {children}
    </div>
  );
};

const TodoStatsWrapperMobile = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <div className="w-full my-6 lg:mt-0 lg:max-w-[40%] block lg:hidden">
      {children}
    </div>
  );
};

const TodoCollapsibleStats = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="lg" className="w-full justify-between">
          <span>View Stats</span>
          <Icon className="w-4 h-4 ml-2" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const TodoConfettiEffect = ({ children }: { children?: React.ReactNode }) => {
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

  return <div>{children}</div>;
};

const FilterPriorityDropdown = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = usePriorityQueryState();

  const Icon = open ? ChevronUpIcon : ChevronDownIcon;

  const foundLabel = priorityOptions.find(
    (option) => option.value === priority
  );

  const buttonSortVariant = cva("text-foreground", {
    variants: {
      priority: {
        [TodoPriorityEnum.LOW]:
          "text-green-500 border-green-500 hover:bg-green-500 hover:text-white",
        [TodoPriorityEnum.MEDIUM]:
          "text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white",
        [TodoPriorityEnum.HIGH]:
          "text-red-500 border-red-500 hover:bg-red-500 hover:text-white",
        [TodoPriorityEnum.CRITICAL]:
          "text-red-500 border-red-500 hover:bg-red-500 hover:text-white",
      },
    },
  });

  const handlePriorityChange = (value: string) => {
    if (value === priority) {
      setPriority(null);
    } else {
      setPriority(value as TodoPriorityEnum);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(buttonSortVariant({ priority }))}
        >
          <Icon className="w-4 h-4 mr-1/2" />
          <span>{foundLabel?.label || "Filter by priority"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={priority as string}
          onValueChange={handlePriorityChange}
        >
          {children}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterPriorityDropdownItem = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem> & {
    value: TodoPriorityEnum;
  }
>(({ children, value, ...props }, ref) => {
  return (
    <DropdownMenuRadioItem ref={ref} {...props} value={value}>
      {children}
    </DropdownMenuRadioItem>
  );
});

FilterPriorityDropdownItem.displayName = "FilterPriorityDropdownItem";
