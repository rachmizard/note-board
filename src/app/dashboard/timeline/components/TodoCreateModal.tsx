"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { DatePicker } from "@/shared/components/ui/datepicker";
import { Combobox } from "@/shared/components/ui/combobox";

interface TodoCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotInfo?: {
    start: Date;
    end: Date;
  };
  onCreateTodo: (title: string, date: Date, priority: string) => Promise<void>;
}

export function TodoCreateModal({
  open,
  onOpenChange,
  slotInfo,
  onCreateTodo,
}: TodoCreateModalProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    slotInfo ? slotInfo.start : undefined
  );
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim() || !dueDate) return;

      try {
        setIsSubmitting(true);
        await onCreateTodo(title, dueDate, priority);
        setTitle("");
        setDueDate(undefined);
        setPriority("medium");
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to create todo:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, dueDate, priority, onCreateTodo, onOpenChange],
  );

  // Format date for display
  const formattedDate = slotInfo
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(slotInfo.start)
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full"
              autoFocus
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">
                Due Date
              </label>
              <DatePicker
                value={dueDate}
                onChange={(date) => setDueDate(date)}
                placeholder="Select due date"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">
                Priority
              </label>
              <Combobox
                value={priority}
                onChange={(value) => setPriority(value)}
                options={priorityOptions}
                placeholder="Select priority"
                emptyText="No priority options available"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !dueDate}>
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}