import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Progress } from "@/shared/components/ui/progress";
import { Check, Plus, Trash } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { TodoWithRelations } from "@/server/database/drizzle/todo.schema";
import { useTodoSubTasks } from "../../_hooks/use-infinite-todo-subtasks";
import {
  useAddTodoSubTask,
  useUpdateTodoSubTask,
  useRemoveTodoSubTask,
} from "../../_mutations/use-subtask-mutations";

interface SubTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: TodoWithRelations;
}

export const SubTaskDialog: React.FC<SubTaskDialogProps> = ({
  open,
  onOpenChange,
  todo,
}) => {
  // Fetch subtasks using our custom hook
  const {
    items: subTasks,
    totalItems,
    isLoading,
    hasNextPage,
    nextPage,
  } = useTodoSubTasks({
    todoId: todo.id,
    limit: 20,
    enabled: open, // Only fetch when dialog is open
  });

  // Mutation hooks
  const addSubTask = useAddTodoSubTask();
  const updateSubTask = useUpdateTodoSubTask();
  const removeSubTask = useRemoveTodoSubTask();

  // Local state
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [editingSubTaskId, setEditingSubTaskId] = useState<number | null>(null);
  const [editedSubTaskTitle, setEditedSubTaskTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Calculate progress
  const completedCount = subTasks.filter((task) => task.completed).length;
  const progressPercentage =
    subTasks.length > 0
      ? Math.round((completedCount / subTasks.length) * 100)
      : 0;

  // Focus edit input when editing starts
  React.useEffect(() => {
    if (editingSubTaskId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingSubTaskId]);

  // Handle adding a new sub-task
  const handleAddSubTask = () => {
    if (newSubTaskTitle.trim() !== "") {
      addSubTask.mutate({
        todoId: todo.id,
        title: newSubTaskTitle,
      });
      setNewSubTaskTitle("");
    }
  };

  // Handle toggling a sub-task's completion status
  const handleToggleComplete = (id: number, completed: boolean) => {
    updateSubTask.mutate({
      id,
      todoId: todo.id,
      completed: !completed,
    });
  };

  // Handle deleting a sub-task
  const handleDeleteSubTask = (id: number) => {
    removeSubTask.mutate({
      id,
      todoId: todo.id,
    });
  };

  // Start editing a sub-task
  const handleStartEditing = (subTask: (typeof subTasks)[0]) => {
    setEditingSubTaskId(subTask.id);
    setEditedSubTaskTitle(subTask.title);
  };

  // Save edited sub-task
  const handleSaveEdit = () => {
    if (editingSubTaskId && editedSubTaskTitle.trim() !== "") {
      updateSubTask.mutate({
        id: editingSubTaskId,
        todoId: todo.id,
        title: editedSubTaskTitle,
      });
      setEditingSubTaskId(null);
    }
  };

  // Handle keyboard events for editing
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setEditingSubTaskId(null);
    }
  };

  // Format date function
  const formatSubTaskDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Handle scroll to load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

    if (isAtBottom && hasNextPage && !isLoading) {
      nextPage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Sub-Tasks for {todo.title}</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {completedCount} of {totalItems} completed
            </span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>

        {/* Add New Sub-Task Form */}
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Add a new sub-task..."
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
            className="flex-1"
          />
          <Button
            onClick={handleAddSubTask}
            size="sm"
            disabled={addSubTask.isPending}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Sub-Tasks List */}
        <ScrollArea className="h-[300px] pr-4" onScroll={handleScroll}>
          <div className="space-y-2">
            {isLoading && subTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading sub-tasks...
              </div>
            ) : subTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No sub-tasks yet. Add one above.
              </div>
            ) : (
              subTasks.map((subTask) => (
                <div
                  key={subTask.id}
                  className="flex items-center space-x-2 p-2 group border rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() =>
                      handleToggleComplete(subTask.id, subTask.completed)
                    }
                    className={cn(
                      "p-1 rounded-sm flex items-center justify-center h-5 w-5 border",
                      subTask.completed
                        ? "bg-blue-400 border-none text-white"
                        : "border-gray-300"
                    )}
                    disabled={updateSubTask.isPending}
                  >
                    {subTask.completed && <Check className="h-4 w-4" />}
                  </button>

                  {/* Sub-Task Title */}
                  <div className="flex-1">
                    {editingSubTaskId === subTask.id ? (
                      <Input
                        ref={editInputRef}
                        value={editedSubTaskTitle}
                        onChange={(e) => setEditedSubTaskTitle(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={handleEditKeyDown}
                        className="p-1 h-7"
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex items-center justify-between w-full",
                          subTask.completed && "text-neutral-400 line-through"
                        )}
                      >
                        <span
                          className="cursor-pointer"
                          onClick={() => handleStartEditing(subTask)}
                        >
                          {subTask.title}
                        </span>
                        <span className="text-xs text-neutral-400 ml-2">
                          {formatSubTaskDate(subTask.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Delete Button - only visible on hover */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteSubTask(subTask.id)}
                    disabled={removeSubTask.isPending}
                  >
                    <Trash className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))
            )}

            {/* Loading indicator for pagination */}
            {isLoading && subTasks.length > 0 && (
              <div className="text-center py-2 text-sm text-muted-foreground">
                Loading more...
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
