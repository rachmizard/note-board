"use client";

import { TodoPriorityEnum } from "@/server/database";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Loader2Icon } from "lucide-react";
import { KeyboardEventHandler, useRef } from "react";
import { useCreateTodo } from "../_mutations/use-create-todo";
import { useInvalidateTodos } from "../_queries/use-todos";

export const AddQuickTodoForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const createTodo = useCreateTodo();
  const invalidateTodos = useInvalidateTodos();

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
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.value = "";
            }
            invalidateTodos();
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
          disabled={createTodo.isPending}
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
