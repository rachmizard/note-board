"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { X } from "lucide-react";

interface TodoCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotInfo?: {
    start: Date;
    end: Date;
  };
  onCreateTodo: (title: string, date: Date) => Promise<void>;
}

export function TodoCreateModal({
  open,
  onOpenChange,
  slotInfo,
  onCreateTodo,
}: TodoCreateModalProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim() || !slotInfo) return;

      try {
        setIsSubmitting(true);
        await onCreateTodo(title, slotInfo.start);
        setTitle("");
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to create todo:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, slotInfo, onCreateTodo, onOpenChange],
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 ${isDark ? "bg-black/70" : "bg-black/50"} backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`}
        />
        <Dialog.Content
          className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 ${isDark ? "bg-gray-900 text-white" : "bg-white"} p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg`}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              Add New Task
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {formattedDate}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}
              >
                Task Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to do?"
                className={`w-full ${isDark ? "bg-gray-800 border-gray-700 text-white" : ""}`}
                autoFocus
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className={
                  isDark
                    ? "border-gray-700 text-gray-200 hover:bg-gray-800"
                    : ""
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? "Adding..." : "Add Task"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

