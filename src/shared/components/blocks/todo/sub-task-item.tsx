import { TodoSubTask } from "@/server/database/drizzle/todo.schema";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import React, { useState } from "react";
import { useUpdateTodoSubTask } from "@/shared/hooks/todo/use-subtask-mutations";

interface SubTaskItemProps {
  subTask: TodoSubTask;
}

export const SubTaskItem: React.FC<SubTaskItemProps> = ({ subTask }) => {
  const updateSubTask = useUpdateTodoSubTask();

  const [checked, setChecked] = useState(subTask.completed);

  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    updateSubTask.mutate({
      id: subTask.id,
      todoId: subTask.todoId ?? -1,
      completed: checked,
    });
  };

  return (
    <div
      key={subTask.id}
      className={cn(
        "flex items-center text-xs p-1.5 rounded-sm gap-2",
        "bg-neutral-50 dark:bg-neutral-800",
        checked && "text-neutral-400"
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheckedChange}
        id={subTask.id.toString()}
        className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 cursor-pointer"
      />
      <Label
        htmlFor={subTask.id.toString()}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          checked && "line-through"
        )}
      >
        {subTask.title}
      </Label>
    </div>
  );
};
