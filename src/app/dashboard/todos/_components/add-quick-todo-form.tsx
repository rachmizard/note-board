"use client";

import { TodoPriorityEnum, TodoStatusEnum } from "@/server/database";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Loader2Icon } from "lucide-react";
import { KeyboardEventHandler, useRef } from "react";
import { useSetFilterQueryState } from "../_hooks/use-filter-query-state";
import { useCreateTodo } from "../_mutations/use-create-todo";

export const AddQuickTodoForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const createTodo = useCreateTodo();

  const setFilter = useSetFilterQueryState();

  const handleQuickAddTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && inputRef.current?.value.trim()) {
      createTodo.mutate(
        {
          title: inputRef.current?.value,
          priority: TodoPriorityEnum.MEDIUM,
          description: "",
        },
        {
          onSuccess: () => {
            setFilter(TodoStatusEnum.BACKLOG);
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.select();
              inputRef.current.value = "";
            }
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          onKeyDown={handleQuickAddTodo}
          placeholder="Type a new task and press Enter to add"
          className="w-full"
        />
        {createTodo.isPending && (
          <Loader2Icon className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {createTodo.error && (
        <p data-slot="form-message" className={cn("text-destructive text-sm")}>
          {createTodo.error.message}
        </p>
      )}
    </div>
  );
};
