"use client";

import { TodoPriorityEnum, TodoStatusEnum } from "@/server/database";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { FormEventHandler, useRef } from "react";
import { useSetFilterQueryState } from "../_hooks/use-filter-query-state";
import { useCreateTodo } from "../_mutations/use-create-todo";

export const AddQuickTodoForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const createTodo = useCreateTodo();

  const setFilter = useSetFilterQueryState();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (inputRef.current?.value.trim()) {
      const value = inputRef.current?.value;

      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
        inputRef.current.value = "";
      }

      createTodo.mutate(
        {
          title: value,
          priority: TodoPriorityEnum.MEDIUM,
          description: "",
        },
        {
          onSuccess: () => {
            setFilter(TodoStatusEnum.BACKLOG);
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          ref={inputRef}
          placeholder="Type a new task and press Enter to add"
          className="w-full"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          disabled={createTodo.isPending}
        >
          {createTodo.isPending ? (
            <Loader2Icon className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
        </Button>
      </form>

      {createTodo.error && (
        <p data-slot="form-message" className={cn("text-destructive text-sm")}>
          {createTodo.error.message}
        </p>
      )}
    </div>
  );
};
